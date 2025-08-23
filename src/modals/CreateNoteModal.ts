import {CyclearnCreateObjectModal} from "./CyclearnCreateObjectModal";
import {CreateContainer, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateCheckboxInputGroup} from "../utils/U_CreateInputElements";
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
import {BuildFieldRecord, CreateInputGroupForFieldRecord} from "../utils/U_FlashcardsDataTreatmentUtils";

/**
 * Modal for creating a new Cyclearn note and its related cards.
 *
 * Provides a form with :
 * - A selector for the deck the note will be stored in.
 * - A selector for the template the note will follow.
 * - A checkbox input controlling if the note must have one or two cards (Front > Back OR Front > Back & Back > Front).
 * - As many input fields as input fields contained in the template front and back field records.
 *
 * On confirmation, the note and its related cards are created in the database and the modal closes.
 */
export class CreateNoteModal extends CyclearnCreateObjectModal {
    /**
     * Builds the modal content :
     * - Adds selectors for deck and template choices ;
     * - Adds a checkbox input controlling if the note has two cards ;
     * - Adds as many input fields as needed when the template selector point at another template ;
     * - Adds a confirm button that triggers note and cards creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers note and cards creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @protected
     */
    protected BuildMain(parent: HTMLElement): void {
        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        // const tagTable: Tag[] = Tag.ReadAll(database);

        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Deck Selector
        const deckSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);

        // Template Selector
        const templateSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);

        // Has Two Faces Checkbox
        const hasTwoFacesCheckbox: HTMLDivElement = CreateCheckboxInputGroup(generalInformationContainer, new InputGroupData(null, "Generate two cards : Front & Back.", null, "true"));
        const hasTwoFacesCheckboxInput: HTMLInputElement = hasTwoFacesCheckbox.querySelector("input");

        // Field Information Section
        const fieldInformationContainer: HTMLElement = CreateSection(parent);

        // Front Field Sub-Section
        CreateSubtitle(fieldInformationContainer, "Front fields");
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);

        // Back Field Sub-Section
        CreateSubtitle(fieldInformationContainer, "Back fields");
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);

        /**
         * Template Selector onChange Event
         * @description Empty field containers and create the field input groups required for the note to be created using the selected template.
         */
        templateSelector.onChange(() => {
            const selectedTemplate: Template = Template.ReadOne(database, templateSelector.getValue());
            frontFieldContainer.empty();
            CreateInputGroupForFieldRecord(frontFieldContainer, selectedTemplate.frontFields, null);
            backFieldContainer.empty();
            CreateInputGroupForFieldRecord(backFieldContainer, selectedTemplate.backFields, null);
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
     * Creates the new note and its related cards in the database using the provided form inputs.
     * Closes the modal once the deck is created.
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