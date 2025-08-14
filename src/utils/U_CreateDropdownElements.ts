import {DropdownComponent} from "obsidian";

export function CreateDropdown(parent: HTMLElement, defaultString: string, classes: string[] = []): DropdownComponent {
    classes.push(
        ""
    );
    let createdEl: DropdownComponent;
    createdEl = new DropdownComponent(parent);
    createdEl.selectEl.addClass(classes.join(" "));
    createdEl.addOption("default", defaultString);
    return createdEl;
}

export function CreateOptionsForDropdown(parent: DropdownComponent, dataset: Record<string, {value: string; placeholder: string}>) {
    Object.values(dataset).forEach(({value, placeholder}) => {
        parent.addOption(value, placeholder);
    })
}