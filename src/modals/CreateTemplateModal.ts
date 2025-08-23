import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
import {ButtonComponent} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {Template} from "../objects/Template";
import {database} from "../database/Database";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {CreateContainer, CreateSection} from "../utils/U_CreateSemanticElements";
import Loki from "lokijs";
import {BuildFieldRecord, GenerateTemplateFieldInputGroupContainer} from "../utils/U_FlashcardsDataTreatmentUtils";

/**
 * Modal for creating a new Flashcards template.
 *
 * Provides a form with :
 * - An input field for the template name ;
 * - An input field for the template description ;
 * - Two dynamic sub-forms containing input field and dropdown usable to add a new field to the front or the back of the template fields ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.

 * On confirmation, the template is created in the database and the modal closes.
 */
export class CreateTemplateModal extends FlashcardsCreateObjectModal {
    /**
     * Builds the modal content :
     * - Adds an input fields for template name and description ;
     * - Adds a button allowing the user to create a new template field for the front part of the template ;
     * - Adds a button allowing the user to create a new template field for the back part of the template ;
     * - Adds a confirm button that triggers template creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers template creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @protected
     */
    protected BuildMain(parent: HTMLElement): void {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Template Name Input
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "A wonderful template", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        // Template Description Input
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This template is templating !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        // Field Information Section
        const fieldInformationContainer: HTMLElement = CreateSection(parent);

        // Front Field Sub-Section
        const frontFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(frontFieldHeader, "Front fields", ["flashcards--width-fit-content"]);
        const addFrontFieldButton: ButtonComponent = CreateButton(frontFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        addFrontFieldButton.onClick(async () => {
           GenerateTemplateFieldInputGroupContainer(frontFieldContainer);
        });

        // Back Field Sub-Section
        const backFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(backFieldHeader, "Back fields", ["flashcards--width-fit-content"]);
        const addBackFieldButton: ButtonComponent = CreateButton(backFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        addBackFieldButton.onClick(async () => {
            GenerateTemplateFieldInputGroupContainer(backFieldContainer);
        });

        // Submit Section
        const submitContainer: HTMLElement = CreateSection(parent);

        // Confirm Button
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput);
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput);
            }
        });
    }

    /**
     * Creates the new template in the database using the provided form inputs.
     * Closes the modal once the template is created.
     * @param database - The LokiJS database instance.
     * @param frontFieldContainer - Front field container.
     * @param backFieldContainer - Back Field Container.
     * @param nameInput - Deck name input element.
     * @param descriptionInput - Deck description input element.
     * @protected
     */
    protected ProcessData(database: Loki, frontFieldContainer?: HTMLDivElement, backFieldContainer?: HTMLDivElement, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let frontFields: Record<string, string> = BuildFieldRecord(frontFieldContainer);
        let backFields: Record<string, string> = BuildFieldRecord(backFieldContainer);
        Template.Create(database, nameInput.value, descriptionInput.value, frontFields, backFields);
        this.close();
    }
}