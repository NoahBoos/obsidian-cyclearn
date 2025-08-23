import {App, Modal} from "obsidian";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateTitle} from "../utils/U_CreateTextualElements";

/**
 * Abstract modal used as a base for creating Modal that aims to create a Cyclearn-related objects.
 *
 * This class provides a predefined modal structure with :
 * - A header implementing a customizable title ;
 * - A main content area to be built with instance methods.
 *
 * Inheriting classes must implement the `BuildMain()` method to define the content of the main content area of the modal.
 * Inheriting classes must also implement the `ProcessData()` to handle data persistence and processing logic.
 */
export abstract class CyclearnCreateObjectModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     */
    constructor(app: App, modalOptions: I_ModalOptions) {
        super(app);
        this.modalOptions = modalOptions;
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
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main);
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
     * Builds the main content of the modal.
     * Must be implemented by subclasses to define UI components.
     * @param {HTMLElement} parent - The parent HTML Element where content should be added initially.
     * @protected
     */
    protected abstract BuildMain(parent: HTMLElement): void;

    /**
     * Processes the data collected in a modal (e.g., input or selector values).
     * Must be implemented by subclasses to achieve data processing and database interaction.
     * @param database - The LokiJS database instance where data should be stored after being processed.
     * @protected
     */
    protected abstract ProcessData(database: Loki): void;
}