import {InputGroupData} from "../objects/InputGroupData";

export function CreateLabel(parent: HTMLElement | Element, text: string, classes: string[] = []): HTMLLabelElement {
    classes.push();
    let createdEl: HTMLLabelElement;
    createdEl = parent.createEl("label", {
        text: text,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateInput(parent: HTMLElement | Element, type: string, placeholder: string = "", value: string = "", classes: string[] = []): HTMLInputElement {
    classes.push();
    let createdEl: HTMLInputElement;
    createdEl = parent.createEl("input", {
        type: type,
        placeholder: placeholder,
        value: value,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateInputGroups(parent: HTMLElement | Element, inputData: InputGroupData) {
    const createdLabel = CreateLabel(parent, inputData.fieldName);
    const createdInput = CreateInput(parent, inputData.fieldType, inputData.fieldPlaceholder, inputData.fieldValue);
    return createdInput;
}