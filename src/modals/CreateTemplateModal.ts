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

export class CreateTemplateModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement): void {
        CreateSubtitle(parent, "General Information", ["flashcards__heading--text-align-left"]);
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "A wonderful template", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This template is templating !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        const fieldHeader: HTMLDivElement = CreateContainer(parent, ["flashcards__horizontal-container"]);
        CreateSubtitle(fieldHeader, "Fields", ["flashcards__heading--width-fit-content", "flashcards__heading--text-align-left"]);
        const addFieldButton: ButtonComponent = CreateButton(fieldHeader, true, "", "plus", ["flashcards__in-header-button"]);
        const fieldContainer: HTMLDivElement = CreateContainer(parent, ["flashcards__vertical-container"]);
        addFieldButton.onClick(async () => {
           const fieldInputGroupContainer: HTMLDivElement = CreateContainer(fieldContainer, ["flashcards__horizontal-container"]);
           const fieldInput: HTMLInputElement = CreateInput(fieldInputGroupContainer, "text", "A cool field", null, ["flashcards__input--width-100"]);
           const fieldSelector: DropdownComponent = CreateDropdown(fieldInputGroupContainer, "No type selected", ["flashcards__dropdown--width-fit-content"]);
           CreateOptionsForDropdownFromRecord(fieldSelector, AUTHORIZED_ELEMENT_TYPES);
        });

        let fields: Record<string, string> = {};
        const confirmButton: ButtonComponent = CreateButton(parent, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            for (const field of fieldContainer.querySelectorAll("div")) {
                let fieldInput: HTMLInputElement = field.querySelector("input");
                let fieldSelector: HTMLSelectElement = field.querySelector("select");
                fields[fieldInput.value] = fieldSelector.value;
            }
            Template.Create(database, nameInput.value, descriptionInput.value, fields);
            this.close();
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                for (const field of fieldContainer.querySelectorAll("div")) {
                    let fieldInput: HTMLInputElement = field.querySelector("input");
                    let fieldSelector: HTMLSelectElement = field.querySelector("select");
                    fields[fieldInput.value] = fieldSelector.value;
                }
                event.preventDefault();
                Template.Create(database, nameInput.value, descriptionInput.value, fields);
                this.close();
            }
        })
    }
}