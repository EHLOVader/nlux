import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + promptBox + disableSubmitButton', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When no disableSubmitButton option is initially provided', () => {
        it('The submit button should be initially disabled', async () => {
            // Given
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);
            await waitForRenderCycle();

            // When
            const button = container.querySelector('.nlux-comp-prmptBox > button')!;

            // Then
            expect(button.getAttribute('disabled')).toBe('');
        });

        describe('When the user types in the text area', () => {
            it('The submit button should be enabled', async () => {
                // Given
                const {container, rerender} = render(<AiChat adapter={adapterController!.adapter}/>);
                await waitForRenderCycle();
                const textArea = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                const button = container.querySelector('.nlux-comp-prmptBox > button')!;

                // When
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Then
                expect(button.getAttribute('disabled')).toBeNull();
            });
        });
    });
});