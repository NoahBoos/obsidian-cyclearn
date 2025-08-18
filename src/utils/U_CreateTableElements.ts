export function CreateTable(parent: HTMLElement, classes: string[] = []): HTMLTableElement {
    classes.push(
        "flashcards--width-100",
        "flashcards--table"
    );
    let createdEl: HTMLTableElement;
    createdEl = parent.createEl("table", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}

export function CreateTableHeader(table: HTMLTableElement, dataset: string[], classes: string[] = []): HTMLTableRowElement {
    classes.push();
    let createdRowEl: HTMLTableRowElement;
    createdRowEl = table.createEl("tr", {
        cls: [classes.join(" ")]
    });
    dataset.forEach((value: string) => {
       createdRowEl.createEl("th", {
           text: value
       });
    });
    return createdRowEl;
}

export function CreateTableRow(table: HTMLTableElement, dataset: string[], classes: string[] = []): HTMLTableRowElement {
    classes.push();
    let createdRowEl: HTMLTableRowElement;
    createdRowEl = table.createEl("tr", {
        cls: [classes.join(" ")]
    });
    dataset.forEach((value: string) => {
        createdRowEl.createEl("td", {
            text: value
        });
    });
    return createdRowEl;
}