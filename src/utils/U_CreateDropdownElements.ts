import {DropdownComponent} from "obsidian";
import {Deck} from "../objects/Deck";
import {Tag} from "../objects/Tag";
import {Template} from "../objects/Template";

export function CreateDropdown(parent: HTMLElement, defaultString: string, classes: string[] = []): DropdownComponent {
    classes.push(
        "flashcards--width-100"
    );
    let createdEl: DropdownComponent;
    createdEl = new DropdownComponent(parent);
    createdEl.selectEl.addClasses(classes);
    createdEl.addOption("default", defaultString);
    return createdEl;
}

export function CreateOptionsForDropdownFromRecord(parent: DropdownComponent, dataset: Record<string, string>) {
    parent.addOptions(dataset);
}

export function CreateOptionsForDropdownFromTable(parent: DropdownComponent, dataset: Array<Deck | Tag | Template>) {
    dataset.forEach((element: Deck | Tag | Template) => {
        parent.addOption(element.id, element.name);
    })
}