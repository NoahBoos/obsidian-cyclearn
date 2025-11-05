import {CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";
import {Tag} from "../objects/Tag";

/**
 * Modal for updating a Cyclearn tag.
 *
 * Provides a prefilled form with :
 * - An input field for the tag name ;
 * - An input field for the tag description ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the tag is updated in the database and the modal closes.
 */
export class UpdateTagModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The tag to update.
     */
    tagToUpdate: Tag;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param tagToUpdate - The tag to update.
     */
    constructor(app: App, modalOptions: I_ModalOptions, tagToUpdate: Tag) {
        super(app);
        this.modalOptions = modalOptions;
        this.tagToUpdate = tagToUpdate;
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
        this.BuildMain(main, this.tagToUpdate);
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
     * - Adds an input fields for tag name and description ;
     * - Adds a confirm button that triggers tag update ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers tag update.
     * @param parent - The parent HTML Element where the form is rendered.
     * @param {Tag} tagToUpdate - The tag to update.
     * @protected
     */
    protected BuildMain(parent: HTMLElement, tagToUpdate: Tag) {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Tag Name Input (Auto-Filling)
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "My cool deck", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = tagToUpdate.name;

        // Tag Description Input (Auto-Filling)
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This deck teaches cool thingies !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        descriptionInput.value = tagToUpdate.description;

        // Submit Section
        const submitContainer: HTMLElement = CreateSection(parent);

        // Confirm Button
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(() => {
            this.ProcessData(database, nameInput, descriptionInput);
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, nameInput, descriptionInput);
            }
        });
    }

    /**
     * Creates the new tag in the database using a partial and the provided form inputs.
     * Closes the modal once the tag is updated.
     * @param database - The LokiJS database instance.
     * @param nameInput - Tag name input element.
     * @param descriptionInput - Tag description input element.
     * @protected
     */
    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let partialTag: Partial<Tag> = {};
        partialTag.name = nameInput.value;
        partialTag.description = descriptionInput.value;
        Tag.Update(database, this.tagToUpdate.id, partialTag);
        this.close();
    }
}