import {InputGroupData} from "../objects/InputGroupData";
import {CreateContainer} from "./U_CreateSemanticElements";

export function CreateLabel(parent: HTMLElement | Element, text: string, classes: string[] = []): HTMLLabelElement {
    classes.push(
        ""
    );
    let createdEl: HTMLLabelElement;
    createdEl = parent.createEl("label", {
        text: text,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateInput(parent: HTMLElement | Element, type: string, placeholder: string = "", value: string = "", classes: string[] = []): HTMLInputElement {
    classes.push(
        ""
    );
    let createdEl: HTMLInputElement;
    createdEl = parent.createEl("input", {
        type: type,
        placeholder: placeholder,
        value: value,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateInputGroup(parent: HTMLElement | Element, inputData: InputGroupData) {
    const inputGroupContainer: HTMLDivElement = CreateContainer(parent, ["flashcards--flex-column", "flashcards--gap-8"]);
    CreateLabel(inputGroupContainer, inputData.fieldName);
    CreateInput(inputGroupContainer, inputData.fieldType, inputData.fieldPlaceholder, inputData.fieldValue);
    return inputGroupContainer;
}

export function CreateCheckboxInputGroup(parent: HTMLElement | Element, inputData: InputGroupData): HTMLDivElement {
    const inputGroupContainer: HTMLDivElement = CreateContainer(parent, ["flashcards--flex-row", "flashcards--align-center", "flashcards--gap-8"]);
    const checkbox: HTMLInputElement = CreateInput(inputGroupContainer, "checkbox");
    checkbox.checked = Boolean(inputData.fieldValue);
    CreateLabel(inputGroupContainer, inputData.fieldName);
    return inputGroupContainer;
}