import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + submit prompt + batch adapter', () => {
    let adapterController: AdapterController | undefined = undefined;

    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When a prompt is submitted', () => {
        it('Should show an active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--active';
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment).toBeInTheDocument();
        });

        it('Should show a loader in the active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const loaderSelector = '.nlux-chatSegment--active > .nlux-chatSegment-loader-container';
            const loader = rootElement.querySelector(loaderSelector);
            expect(loader).toBeInTheDocument();
        });

        it('The prompt should not be removed from the composer while loading', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(textArea.value).toBe('Hello');
        });
    });

    describe('When a response is returned', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment!.classList.contains('nlux-chatSegment--complete')).toBe(true);
            expect(activeSegment!.classList.contains('nlux-chatSegment--active')).not.toBe(true);
        });

        it('The loader should be removed from the active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            const loaderSelector = '.nlux-chatSegment--active > .nlux-chatSegment-loader-container';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const loader = rootElement.querySelector(loaderSelector);
            expect(loader).not.toBeInTheDocument();
        });

        it('The prompt should be removed from the composer', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            expect(textArea.value).toBe('');
        });
    });

    describe('When the fetch prompt submission fails', () => {
        it('The active segment should be removed', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController?.reject('Sorry user!');
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--active';
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment).not.toBeInTheDocument();
        });

        it('Complete segments should not be removed', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--active';
            const completeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--complete';

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.resolve('Hi! How can I help you?');
            await waitForRenderCycle();

            // Assert
            const completeSegment = rootElement.querySelector(completeSegmentSelector);
            expect(completeSegment).toBeInTheDocument();

            // Act again
            await userEvent.type(textArea, 'How are you?{enter}');
            await waitForRenderCycle();

            adapterController?.reject('Sorry user!');
            await waitForRenderCycle();

            // Assert
            const completeSegmentAgain = rootElement.querySelector(completeSegmentSelector);
            const activeSegment = rootElement.querySelector(activeSegmentSelector);

            expect(completeSegmentAgain).toBeInTheDocument();
            expect(activeSegment).not.toBeInTheDocument();
        });

        it('The prompt should be restored to the composer', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController?.reject('Sorry user!');
            await waitForRenderCycle();

            // Assert
            expect(textArea.value).toBe('Hello');
        });
    });
});
