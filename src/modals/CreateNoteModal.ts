import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
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
import Loki from "lokijs";
import {GetToday, GetTomorrow} from "../utils/U_GenerateDate";

export class CreateNoteModal extends FlashcardsCreateObjectModal {
    protected BuildMain(parent: HTMLElement): void {
        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        // const tagTable: Tag[] = Tag.ReadAll(database);

        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");
        const deckSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);
        const templateSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);
        const hasTwoFacesCheckboxInputGroupData: InputGroupData = new InputGroupData(null, "Generate two cards : Front & Back.", null, "true");
        const hasTwoFacesCheckbox: HTMLDivElement = CreateCheckboxInputGroup(generalInformationContainer, hasTwoFacesCheckboxInputGroupData);
        const hasTwoFacesCheckboxInput: HTMLInputElement = hasTwoFacesCheckbox.querySelector("input");

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        /// Front Field Container Code
        CreateSubtitle(fieldInformationContainer, "Front fields");
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        /// Back Field Container Code
        CreateSubtitle(fieldInformationContainer, "Back fields");
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        templateSelector.onChange(() => {
            const selectedTemplate: Template = Template.ReadOne(database, templateSelector.getValue());
            frontFieldContainer.empty();
            for (let fieldsKey in selectedTemplate.frontFields) {
                CreateInputGroup(frontFieldContainer, new InputGroupData("text", fieldsKey, fieldsKey, null));
            }
            backFieldContainer.empty();
            for (let fieldsKey in selectedTemplate.backFields) {
                CreateInputGroup(backFieldContainer, new InputGroupData("text", fieldsKey, fieldsKey, null));
            }
        });

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(() => {
            this.ProcessData(database, frontFieldContainer, backFieldContainer, deckSelector, templateSelector, hasTwoFacesCheckboxInput);
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, frontFieldContainer, backFieldContainer, deckSelector, templateSelector, hasTwoFacesCheckboxInput);
            }
        });
    }

    protected ProcessData(database: Loki, frontFieldContainer?: HTMLDivElement, backFieldContainer?: HTMLDivElement, deckSelector?: DropdownComponent, templateSelector?: DropdownComponent, hasTwoFacesCheckboxInput?: HTMLInputElement): void {
        let frontFields: Record<string, string> = {};
        for (const field of frontFieldContainer.querySelectorAll("div")) {
            let fieldLabel: HTMLLabelElement = field.querySelector("label");
            let fieldInput: HTMLInputElement = field.querySelector("input");
            frontFields[fieldLabel.textContent] = fieldInput.value;
        }
        let backFields: Record<string, string> = {};
        for (const field of backFieldContainer.querySelectorAll("div")) {
            let fieldLabel: HTMLLabelElement = field.querySelector("label");
            let fieldInput: HTMLInputElement = field.querySelector("input");
            backFields[fieldLabel.textContent] = fieldInput.value;
        }
        let addedNote: Note = Note.Create(database, deckSelector.getValue(), templateSelector.getValue(), frontFields, backFields, hasTwoFacesCheckboxInput.checked);
        if (addedNote.hasTwoFaces) {
            Card.Create(database, addedNote.id, parseInt(GetToday()), CardType.FRONT);
            Card.Create(database, addedNote.id, parseInt(GetTomorrow()), CardType.BACK);
        } else {
            Card.Create(database, addedNote.id, parseInt(GetToday()), CardType.FRONT);
        }
        this.close();
    }
}