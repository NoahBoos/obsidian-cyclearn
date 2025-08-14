export function CreateTitle(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h1", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateSubtitle(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h2", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateH3(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h3", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateH4(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h4", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateH5(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h5", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateH6(parent: HTMLElement | Element, title: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("h6", {
        text: title,
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateParagraph(parent: HTMLElement | Element, text: string, classes: string[] = []): HTMLElement {
    classes.push(
        ""
    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("p", {
        text: text,
        cls: [classes.join(" ")]
    });
    return createdEl;
}