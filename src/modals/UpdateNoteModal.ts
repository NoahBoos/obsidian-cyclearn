import {CreateContainer, CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateCheckboxInputGroup, CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, DropdownComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";
import {Template} from "../objects/Template";
import {CreateDropdown, CreateOptionsForDropdownFromTable} from "../utils/U_CreateDropdownElements";
import {Note} from "../objects/Note";
import {Card} from "../objects/Card";
import {CardType} from "../objects/E_CardType";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";
import {GetToday, GetTomorrow} from "../utils/U_GenerateDate";
import {BuildFieldRecord, CreateInputGroupForFieldRecord} from "../utils/U_FlashcardsDataTreatmentUtils";

export class UpdateNoteModal extends Modal {
    modalOptions: I_ModalOptions;
    noteToUpdate: Note;

    constructor(app: App, modalOptions: I_ModalOptions, noteToUpdate: Note) {
        super(app);
        this.modalOptions = modalOptions;
        this.noteToUpdate = noteToUpdate;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main, this.noteToUpdate);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    protected BuildMain(parent: HTMLElement, noteToUpdate: Note): void {
        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        // const tagTable: Tag[] = Tag.ReadAll(database);

        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");
        const deckSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);
        deckSelector.setValue(noteToUpdate.id_deck);
        const templateSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);
        templateSelector.setValue(noteToUpdate.id_template);
        const hasTwoFacesCheckbox: HTMLDivElement = CreateCheckboxInputGroup(generalInformationContainer, new InputGroupData(null, "Generate two cards : Front & Back.", null, "true"));
        const hasTwoFacesCheckboxInput: HTMLInputElement = hasTwoFacesCheckbox.querySelector("input");
        hasTwoFacesCheckboxInput.checked = noteToUpdate.hasTwoFaces;

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        /// Front Field Container Code
        CreateSubtitle(fieldInformationContainer, "Front fields");
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        CreateInputGroupForFieldRecord(frontFieldContainer, noteToUpdate.frontFields, noteToUpdate.frontFields);
        /// Back Field Container Code
        CreateSubtitle(fieldInformationContainer, "Back fields");
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        CreateInputGroupForFieldRecord(backFieldContainer, noteToUpdate.backFields, noteToUpdate.backFields);
        templateSelector.onChange(() => {
            const selectedTemplate: Template = Template.ReadOne(database, templateSelector.getValue());
            frontFieldContainer.empty();
            CreateInputGroupForFieldRecord(frontFieldContainer, selectedTemplate.frontFields, noteToUpdate.frontFields);
            backFieldContainer.empty();
            CreateInputGroupForFieldRecord(backFieldContainer, selectedTemplate.backFields, noteToUpdate.backFields);
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
        let frontFields: Record<string, string> = BuildFieldRecord(frontFieldContainer);
        let backFields: Record<string, string> = BuildFieldRecord(backFieldContainer);
        let partialNote: Partial<Note> = {};
        partialNote.id_deck = deckSelector.getValue();
        partialNote.id_template = templateSelector.getValue();
        partialNote.frontFields = frontFields;
        partialNote.backFields = backFields;
        partialNote.hasTwoFaces = hasTwoFacesCheckboxInput.checked;
        Note.Update(database, this.noteToUpdate.id, partialNote)
        if (partialNote.hasTwoFaces != this.noteToUpdate.hasTwoFaces) {
            const existingCards: Card[] = Card.ReadAllByNote(database, this.noteToUpdate.id);
            if (partialNote.hasTwoFaces && existingCards.length == 1) {
                Card.Create(database, this.noteToUpdate.id, parseInt(GetTomorrow()), CardType.BACK);
            } else if (!partialNote.hasTwoFaces && existingCards.length == 2) {
                let backCardToDelete: Card = existingCards.find(card => card.card_type == CardType.BACK);
                if (backCardToDelete) Card.Delete(database, backCardToDelete.id);
            }
        }
        this.close();
    }
}