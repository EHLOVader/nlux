import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {ConversationStarter} from '@nlux-dev/core/src/types/conversationStarter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + conversationOptions + conversationStarters', () => {
    let adapterController: AdapterController | undefined;
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

    describe('When conversationStarters are provided', () => {
        it('They should be displayed when the conversation is empty', async () => {
            // Arrange
            const conversationStarters: ConversationStarter[] = [
                {prompt: 'Hello, World!'},
                {prompt: 'How are you?'},
            ];

            // Act
            aiChat = createAiChat()
                .withConversationOptions({conversationStarters})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const conversationStarterElements = rootElement.querySelectorAll('.nlux-comp-conversationStarter');
            expect(conversationStarterElements).toHaveLength(conversationStarters.length);
            conversationStarterElements.forEach((conversationStarterElement, index) => {
                expect(conversationStarterElement).toHaveTextContent(conversationStarters[index].prompt);
            });
        });

        describe('When conversationStarters are removed after initial render', () => {
            it('They should not be displayed', async () => {
                // Arrange
                const conversationStarters: ConversationStarter[] = [
                    {prompt: 'Hello, World!'},
                    {prompt: 'How are you?'},
                ];

                // Act
                aiChat = createAiChat()
                    .withConversationOptions({conversationStarters})
                    .withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({conversationOptions: {}});
                await waitForRenderCycle();

                // Assert
                const conversationStarterElements = rootElement.querySelectorAll('.nlux-comp-conversationStarter');
                expect(conversationStarterElements).toHaveLength(0);
            });
        });

        describe('When the user submits a prompt', () => {
            it.todo('The conversationStarters should not be displayed', async () => {
            });

            describe('When the prompt submission fails', () => {
                it.todo('The conversationStarters should be displayed again', async () => {
                });
            });
        });

        describe('When the user selects a conversation starter', () => {
            it('A matching prompt should be submitted', async () => {
                // Arrange
                const conversationStarters: ConversationStarter[] = [
                    {prompt: 'Hello, World!'},
                    {prompt: 'How are you?'},
                ];
                const conversationStarterIndex = 1;

                // Act
                aiChat = createAiChat()
                    .withConversationOptions({conversationStarters})
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const conversationStarterElements = rootElement.querySelector('.nlux-comp-conversationStarter') as HTMLElement;
                conversationStarterElements.click();
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith(conversationStarters[0].prompt);
            });
        });
    });

    describe('When conversationStarters are not provided', () => {
        it('They should not be displayed when the conversation is empty', async () => {
            // Act
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const conversationStarterElements = rootElement.querySelectorAll('.nlux-comp-conversationStarter');
            expect(conversationStarterElements).toHaveLength(0);
        });
    });

    describe('When conversationStarters are provided and the conversation is not empty', () => {
        it.todo('They should not be displayed', async () => {
        });
    });
});
