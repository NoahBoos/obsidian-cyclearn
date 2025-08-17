export function CreateContainer(parent: HTMLElement | Element, classes: string[] = []): HTMLDivElement {
    classes.push(
        "flashcards--width-100"
    );
    let createdEl: HTMLDivElement;
    createdEl = parent.createEl("div", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateHeader(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        "flashcards--width-100",
        "flashcards--flex-row",
        "flashcards--justify-between",
        "flashcards--align-center"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("header", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateMain(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        "flashcards--width-100",
        "flashcards--flex-column",
        "flashcards--justify-center",
        "flashcards--align-center",
        "flashcards--gap-16"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("main", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateSection(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        "flashcards--width-100",
        "flashcards--flex-column",
        "flashcards--justify-center",
        "flashcards--align-center",
        "flashcards--gap-16"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("section", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateArticle(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        "flashcards--width-100"
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("article", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateAside(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("aside", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateFooter(parent: HTMLElement | Element, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("footer", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}