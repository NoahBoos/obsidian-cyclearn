import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "./U_CreateInputElements";

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