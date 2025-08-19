export function CreateRule(parent: HTMLElement, classes: string[] = []) {
    classes.push(

    );
    let createdEl: HTMLElement;
    createdEl = parent.createEl("hr", {
        cls: [classes.join(" ")]
    });
    return createdEl;
}