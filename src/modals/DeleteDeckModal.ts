import {App, ButtonComponent, Modal} from "obsidian";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {CreateParagraph, CreateTitle} from "../utils/U_CreateTextualElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";

/**
 * Modal for deleting a Flashcards deck.
 *
 * Provides :
 * - A disclaimer message ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the deck is deleted in the database and the modal closes.
 */
export class DeleteDeckModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The deck to delete.
     */
    deckToDelete: Deck;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param deckToDelete - The deck to delete.
     */
    constructor(app: App, modalOptions: I_ModalOptions, deckToDelete: Deck) {
        super(app);
        this.modalOptions = modalOptions;
        this.deckToDelete = deckToDelete;
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
        CreateParagraph(main, "Are you sure you want to delete this deck ?");

        // Delete Button
        const deleteButton: ButtonComponent = CreateButton(main, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        deleteButton.onClick(() => {
            Deck.Delete(database, this.deckToDelete.id);
            this.close();
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Deck.Delete(database, this.deckToDelete.id);
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