import {CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";

/**
 * Modal for updating a Cyclearn deck.
 *
 * Provides a prefilled form with :
 * - An input field for the deck name ;
 * - An input field for the deck description ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the deck is updated in the database and the modal closes.
 */
export class UpdateDeckModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The deck to update.
     */
    deckToUpdate: Deck;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param deckToUpdate - The deck to update.
     */
    constructor(app: App, modalOptions: I_ModalOptions, deckToUpdate: Deck) {
        super(app);
        this.modalOptions = modalOptions;
        this.deckToUpdate = deckToUpdate;
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
        this.BuildMain(main, this.deckToUpdate);
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
     * - Adds input fields for deck name and description ;
     * - Adds a confirm button that triggers deck update ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers deck update.
     * @param {HTMLElement} parent - The parent HTML Element where content should be added initially.
     * @param {Deck} deckToUpdate - The deck to update.
     * @protected
     */
    protected BuildMain(parent: HTMLElement, deckToUpdate: Deck) {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        /// Deck Name Input (Auto-Filling)
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "My cool deck", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = deckToUpdate.name;

        /// Deck Description Input (Auto-Filling)
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This deck teaches cool thingies !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        descriptionInput.value = deckToUpdate.description;

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
     * Updates the new deck in the database using a partial and the provided form inputs.
     * Closes the modal once the deck is updated.
     * @param database - The LokiJS database instance where data should be stored after being processed.
     * @param nameInput - Deck name input element.
     * @param descriptionInput - Deck description input element.
     * @protected
     */
    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let partialDeck: Partial<Deck> = {};
        partialDeck.name = nameInput.value;
        partialDeck.description = descriptionInput.value;
        Deck.Update(database, this.deckToUpdate.id, partialDeck);
        this.close();
    }
}