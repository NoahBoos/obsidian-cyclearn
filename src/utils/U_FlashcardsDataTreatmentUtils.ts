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