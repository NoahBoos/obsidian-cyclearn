export function CreateOrderedList(parent: HTMLElement, classes: string[] = []) {
    classes.push(
        "flashcards--width-fit-content"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("ol", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateUnorderedList(parent: HTMLElement, classes: string[] = []) {
    classes.push(
        "flashcards--width-80"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("ol", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateListElement(parent: HTMLElement, classes: string[] = []) {
    classes.push(

    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("li", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}