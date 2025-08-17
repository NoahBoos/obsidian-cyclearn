import {FlashcardsModal} from "./FlashcardsModal";
import {CreateContainer, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateCheckboxInputGroup, CreateInputGroup} from "../utils/U_CreateInputElements";
import {ButtonComponent, DropdownComponent} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";
import {Template} from "../objects/Template";
import {CreateDropdown, CreateOptionsForDropdownFromTable} from "../utils/U_CreateDropdownElements";
import {Note} from "../objects/Note";
import {Card} from "../objects/Card";
import {CardType} from "../objects/E_CardType";

export class CreateNoteModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement): void {
        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        // const tagTable: Tag[] = Tag.ReadAll(database);

        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General Information", ["flashcards__heading--text-align-left"]);
        const deckSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);
        const templateSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);
        const hasTwoFacesCheckboxInputGroupData: InputGroupData = new InputGroupData(null, "Generate two cards : Front & Back.", null, "true");
        const hasTwoFacesCheckbox: HTMLDivElement = CreateCheckboxInputGroup(generalInformationContainer, hasTwoFacesCheckboxInputGroupData);
        const hasTwoFacesCheckboxInput: HTMLInputElement = hasTwoFacesCheckbox.querySelector("input");

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(fieldInformationContainer, "Field Information", ["flashcards__heading--text-align-left"]);
        const fieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards__container--flex-column"]);
        templateSelector.onChange(() => {
            fieldContainer.empty();
            const selectedTemplate: Template = Template.ReadOne(database, templateSelector.getValue());
            for (let fieldsKey in selectedTemplate.fields) {
                const inputGroupData: InputGroupData = new InputGroupData("text", fieldsKey, fieldsKey, null);
                CreateInputGroup(fieldContainer, inputGroupData);
            }
        });

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        let fields: Record<string, string> = {};
        confirmButton.onClick(() => {
            for (const field of fieldContainer.querySelectorAll("div")) {
                let fieldLabel: HTMLLabelElement = field.querySelector("label");
                let fieldInput: HTMLInputElement = field.querySelector("input");
                fields[fieldInput.value] = fieldLabel.textContent;
            }
            let addedNote: Note = Note.Create(database, deckSelector.getValue(), templateSelector.getValue(), fields, hasTwoFacesCheckboxInput.checked);
            if (addedNote.hasTwoFaces) {
                Card.Create(database, addedNote.id, null, CardType.FRONT);
                Card.Create(database, addedNote.id, null, CardType.BACK);
            } else {
                Card.Create(database, addedNote.id, null, CardType.FRONT);
            }
            this.close();
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                for (const field of fieldContainer.querySelectorAll("div")) {
                    let fieldLabel: HTMLLabelElement = field.querySelector("label");
                    let fieldInput: HTMLInputElement = field.querySelector("input");
                    fields[fieldInput.value] = fieldLabel.textContent;
                }
                let addedNote: Note = Note.Create(database, deckSelector.getValue(), templateSelector.getValue(), fields, hasTwoFacesCheckboxInput.checked);
                if (addedNote.hasTwoFaces) {
                    Card.Create(database, addedNote.id, null, CardType.FRONT);
                    Card.Create(database, addedNote.id, null, CardType.BACK);
                } else {
                    Card.Create(database, addedNote.id, null, CardType.FRONT);
                }
                this.close();
            }
        });
    }
}