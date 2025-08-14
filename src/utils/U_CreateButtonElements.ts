import {ButtonComponent} from "obsidian";

export function CreateButton(parent: HTMLElement, setCTA: boolean, text: string = null, icon: string = null, classes: string[] = []): ButtonComponent {
    classes.push("flashcards__button--default");
    let createdEl: ButtonComponent = new ButtonComponent(parent);
    if (setCTA) {
        createdEl.setCta();
    }
    if (text) {
        createdEl.setButtonText(text);
    }
    if (icon) {
        createdEl.setIcon(icon);
    }
    classes.forEach(cssClass => {
        createdEl.setClass(cssClass);
    })
    return createdEl;
}