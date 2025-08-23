import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import Loki from "lokijs";
import {CreateSection} from "../utils/U_CreateSemanticElements";

/**
 * Modal for creating a new Flashcards tag.
 *
 * Provides a form with :
 * - An input field for the tag name ;
 * - An input field for the tag description ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the tag is created in the database and the modal closes.
 */
export class CreateTagModal extends FlashcardsCreateObjectModal {
    /**
     * Builds the modal content :
     * - Adds an input fields for tag name and description ;
     * - Adds a confirm button that triggers tag creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers tag creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @protected
     */
    protected BuildMain(parent: HTMLElement) {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Tag Name Input
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "My amazing tag", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        // Tag Description Input
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This tag is tagging cool notes !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        // Submit Section
        const submitContainer: HTMLElement = CreateSection(parent);

        // Confirm Button
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, nameInput, descriptionInput);
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
           if (event.shiftKey && event.key === "Enter") {
               event.preventDefault();
               this.ProcessData(database, nameInput, descriptionInput);
           }
        });
    }

    /**
     * Creates the new tag in the database using the provided form inputs.
     * Closes the modal once the tag is created.
     * @param database - The LokiJS database instance.
     * @param nameInput - Tag name input element.
     * @param descriptionInput - Tag description input element.
     * @protected
     */
    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        Tag.Create(database, nameInput.value, descriptionInput.value);
        this.close();
    }
}