export function CreateLabel(parent: HTMLElement | Element, text: string, classes: string[] = []): HTMLLabelElement {
    classes.push();
    let createdEl: HTMLLabelElement;
    createdEl = parent.createEl("label", {
        text: text,
        cls: [
            classes.join(" ")
        ]
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

export function CreateInputGroups(parent: HTMLElement | Element, inputData: Array<Object>) {
    for (let i = 0; i < inputData.length; i++) {
        CreateLabel(parent, inputData[i]["fieldName"]);
        CreateInput(parent, inputData[i]["fieldName"], inputData[i]["fieldValue"]);
    }
}