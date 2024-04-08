import {AvatarProps} from '../props';

export const updateNameOnPicture = (
    element: HTMLElement,
    propsBefore: AvatarProps,
    propsAfter: AvatarProps,
): void => {
    if (propsBefore.name === propsAfter.name) {
        return;
    }

    if (typeof propsAfter.picture === 'string') {
        const letter = propsAfter.name && propsAfter.name.length > 0 ?
            propsAfter.name[0].toUpperCase() : '';

        const letterContainer = element.querySelector(
            '* > .avtr_ctn > .avtr_ltr',
        );

        letterContainer?.replaceChildren(letter);
    }
};
