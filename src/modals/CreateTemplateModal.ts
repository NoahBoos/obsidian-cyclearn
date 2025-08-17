import {FlashcardsModal} from "./FlashcardsModal";
import {ButtonComponent, DropdownComponent} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {Template} from "../objects/Template";
import {database} from "../database/Database";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInput, CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {CreateContainer} from "../utils/U_CreateSemanticElements";
import {CreateDropdown, CreateOptionsForDropdownFromRecord} from "../utils/U_CreateDropdownElements";
import {AUTHORIZED_ELEMENT_TYPES} from "../utils/U_AuthorizedElementTypes";
import Loki from "lokijs";

export class CreateTemplateModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement): void {
        CreateSubtitle(parent, "General Information");
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "A wonderful template", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This template is templating !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        const fieldHeader: HTMLDivElement = CreateContainer(parent, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(fieldHeader, "Fields", ["flashcards--width-fit-content"]);
        const addFieldButton: ButtonComponent = CreateButton(fieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const fieldContainer: HTMLDivElement = CreateContainer(parent, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        addFieldButton.onClick(async () => {
           const fieldInputGroupContainer: HTMLDivElement = CreateContainer(fieldContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
           const fieldInput: HTMLInputElement = CreateInput(fieldInputGroupContainer, "text", "A cool field", null, ["flashcards--width-100"]);
           const fieldSelector: DropdownComponent = CreateDropdown(fieldInputGroupContainer, "No type selected", ["flashcards--width-fit-content"]);
           CreateOptionsForDropdownFromRecord(fieldSelector, AUTHORIZED_ELEMENT_TYPES);
        });

        const confirmButton: ButtonComponent = CreateButton(parent, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, fieldContainer, nameInput, descriptionInput);
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, fieldContainer, nameInput, descriptionInput);
            }
        })
    }

    protected ProcessData(database: Loki, fieldContainer?: HTMLDivElement, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let fields: Record<string, string> = {};
        for (const field of fieldContainer.querySelectorAll("div")) {
            let fieldInput: HTMLInputElement = field.querySelector("input");
            let fieldSelector: HTMLSelectElement = field.querySelector("select");
            fields[fieldInput.value] = fieldSelector.value;
        }
        Template.Create(database, nameInput.value, descriptionInput.value, fields);
        this.close();
    }
}