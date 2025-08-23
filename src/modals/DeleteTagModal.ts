import {App, ButtonComponent, Modal} from "obsidian";
import {Tag} from "../objects/Tag";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {CreateParagraph, CreateTitle} from "../utils/U_CreateTextualElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";

/**
 * Modal for deleting a Cyclearn tag.
 *
 * Provides :
 * - A disclaimer message ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the tag is deleted in the database and the modal closes.
 */
export class DeleteTagModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The tag to delete.
     */
    tagToDelete: Tag;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param tagToDelete - The tag to delete.
     */
    constructor(app: App, modalOptions: I_ModalOptions, tagToDelete: Tag) {
        super(app);
        this.modalOptions = modalOptions;
        this.tagToDelete = tagToDelete;
    }

    /**
     * Called when the modal is opened.
     * Sets up the structure by creating a header, a title in it, a main section and its content.
     */
    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        CreateParagraph(main, "Are you sure you want to delete this tag ?");

        // Delete Button
        const deleteButton: ButtonComponent = CreateButton(main, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        deleteButton.onClick(() => {
            Tag.Delete(database, this.tagToDelete.id);
            this.close();
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Tag.Delete(database, this.tagToDelete.id);
                this.close();
            }
        });
    }

    /**
     * Called when the modal is closed.
     * Cleans up the modal to free memory.
     */
    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}