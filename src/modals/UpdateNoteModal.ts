import {CreateContainer, CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateCheckboxInputGroup} from "../utils/U_CreateInputElements";
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
import {GetTomorrow} from "../utils/U_GenerateDate";
import {BuildFieldRecord, CreateInputGroupForFieldRecord} from "../utils/U_FlashcardsDataTreatmentUtils";

/**
 * Modal for updating a Cyclearn note and its related cards.
 *
 * Provides a prefilled form with :
 * - A selector for the deck the note will be stored in.
 * - A selector for the template the note will follow.
 * - A checkbox input controlling if the note must have one or two cards (Front > Back OR Front > Back & Back > Front).
 * - As many input fields as input fields contained in the template front and back field records.
 *
 * On confirmation, the note and its related cards are updated in the database and the modal closes.
 */
export class UpdateNoteModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The tag to update.
     */
    noteToUpdate: Note;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param noteToUpdate - The note to update.
     */
    constructor(app: App, modalOptions: I_ModalOptions, noteToUpdate: Note) {
        super(app);
        this.modalOptions = modalOptions;
        this.noteToUpdate = noteToUpdate;
    }

    /**
     * Called when the modal is opened.
     * Sets up the structure by creating a header, a title in it and a main section.
     * Delegates main content creation by calling the `BuildMain()` method.
     */
    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main, this.noteToUpdate);
    }

    /**
     * Called when the modal is closed.
     * Cleans up the modal to free memory.
     */
    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    /**
     * Builds the modal content :
     * - Adds selectors for deck and template choices ;
     * - Adds a checkbox input controlling if the note has two cards ;
     * - Adds as many input fields as needed when the template selector point at another template ;
     * - Adds a confirm button that triggers note and cards creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers note and cards creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @param noteToUpdate - The note to update.
     * @protected
     */
    protected BuildMain(parent: HTMLElement, noteToUpdate: Note): void {
        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        // const tagTable: Tag[] = Tag.ReadAll(database);

        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Deck Selector (Auto-Selecting)
        const deckSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);
        deckSelector.setValue(noteToUpdate.id_deck);

        // Template Selector (Auto-Selecting)
        const templateSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);
        templateSelector.setValue(noteToUpdate.id_template);
        // Has Two Faces Checkbox (Auto-Checking)
        const hasTwoFacesCheckbox: HTMLDivElement = CreateCheckboxInputGroup(generalInformationContainer, new InputGroupData(null, "Generate two cards : Front & Back.", null, "true"));
        const hasTwoFacesCheckboxInput: HTMLInputElement = hasTwoFacesCheckbox.querySelector("input");
        hasTwoFacesCheckboxInput.checked = noteToUpdate.hasTwoFaces;

        // Field Information Section
        const fieldInformationContainer: HTMLElement = CreateSection(parent);

        // Front Field Sub-Section
        CreateSubtitle(fieldInformationContainer, "Front fields");
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        CreateInputGroupForFieldRecord(frontFieldContainer, noteToUpdate.frontFields, noteToUpdate.frontFields);

        // Back Field Sub-Section
        CreateSubtitle(fieldInformationContainer, "Back fields");
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        CreateInputGroupForFieldRecord(backFieldContainer, noteToUpdate.backFields, noteToUpdate.backFields);

        /**
         * Template Selector onChange Event
         * @description Empty field containers and create the field input groups required for the note to be created using the selected template.
         */
        templateSelector.onChange(() => {
            const selectedTemplate: Template = Template.ReadOne(database, templateSelector.getValue());
            frontFieldContainer.empty();
            CreateInputGroupForFieldRecord(frontFieldContainer, selectedTemplate.frontFields, noteToUpdate.frontFields);
            backFieldContainer.empty();
            CreateInputGroupForFieldRecord(backFieldContainer, selectedTemplate.backFields, noteToUpdate.backFields);
        });

        // Submit Section
        const submitContainer: HTMLElement = CreateSection(parent);

        // Confirm Button
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(() => {
            this.ProcessData(database, frontFieldContainer, backFieldContainer, deckSelector, templateSelector, hasTwoFacesCheckboxInput);
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, frontFieldContainer, backFieldContainer, deckSelector, templateSelector, hasTwoFacesCheckboxInput);
            }
        });
    }


    /**
     * Updates a note and its related cards in the database using a partial and the provided form inputs.
     * Closes the modal once the note is updated.
     * @param database - The LokiJS database instance.
     * @param frontFieldContainer - Front field container.
     * @param backFieldContainer - Back Field Container.
     * @param deckSelector - Deck Selector.
     * @param templateSelector - Template Selector.
     * @param hasTwoFacesCheckboxInput - Has Two Faces Checkbox input element.
     * @protected
     */
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