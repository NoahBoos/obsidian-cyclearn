import {DropdownComponent} from "obsidian";

export function CreateDropdown(parent: HTMLElement, defaultString: string, classes: string[] = []): DropdownComponent {
    classes.push(
        "flashcards__dropdown--default"
    );
    let createdEl: DropdownComponent;
    createdEl = new DropdownComponent(parent);
    createdEl.selectEl.addClasses(classes);
    createdEl.addOption("default", defaultString);
    return createdEl;
}

export function CreateOptionsForDropdown(parent: DropdownComponent, dataset: Record<string, string>) {
    parent.addOptions(dataset);
}