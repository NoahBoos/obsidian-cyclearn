import {InputGroupData} from "../objects/InputGroupData";
import {CreateInput, CreateInputGroup} from "./U_CreateInputElements";
import {CreateContainer} from "./U_CreateSemanticElements";
import {ButtonComponent, DropdownComponent} from "obsidian";
import {CreateButton} from "./U_CreateButtonElements";
import {CreateDropdown, CreateOptionsForDropdownFromRecord} from "./U_CreateDropdownElements";
import {AUTHORIZED_ELEMENT_TYPES} from "./U_AuthorizedElementTypes";

export function BuildFieldRecord(container: HTMLDivElement): Record<string, string> {
    let fields: Record<string, string> = {};
    for (const field of container.querySelectorAll("div")) {
        let a: HTMLLabelElement | HTMLInputElement;
        let b: HTMLInputElement | HTMLSelectElement;
        if (field.querySelector("label")) {
            a = field.querySelector("label");
            b = field.querySelector("input");
            fields[a.textContent] = b.value;
        } else {
            a = field.querySelector("input");
            b = field.querySelector("select");
            fields[a.value] = b.value;
        }
    }
    return fields;
}

export function CreateInputGroupForFieldRecord(parent: HTMLDivElement, templateFields: Record<string, string>, fieldValues: Record<string, string>) {
    for (let fieldKey in templateFields) {
        CreateInputGroup(parent, new InputGroupData("text", fieldKey, fieldKey, fieldValues != null ? fieldValues[fieldKey] : null));
    }
}

export function GenerateTemplateFieldInputGroupContainer(parent: HTMLElement) {
    const container: HTMLDivElement = CreateContainer(parent, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
    const deleteContainerButton: ButtonComponent = CreateButton(container, false, null, "x", ["flashcards--width-fit-content"]);
    deleteContainerButton.onClick(() => {
        container.remove();
    });
    const fieldInput: HTMLInputElement = CreateInput(container, "text", "A cool field", null, ["flashcards--width-100"]);
    const fieldSelector: DropdownComponent = CreateDropdown(container, "No type selected", ["flashcards--width-fit-content"]);
    CreateOptionsForDropdownFromRecord(fieldSelector, AUTHORIZED_ELEMENT_TYPES);
    return container;
}