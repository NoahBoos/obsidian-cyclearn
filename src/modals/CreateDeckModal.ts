import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {InputGroupData} from "../objects/InputGroupData";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {CreateSection} from "../utils/U_CreateSemanticElements";

/**
 * Modal for creating a new Flashcards deck.
 *
 * Provides a form with :
 * - An input field for the deck name ;
 * - An input field for the deck description ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.
 *
 * On confirmation, the deck is created in the database and the modal closes.
 */
export class CreateDeckModal extends FlashcardsCreateObjectModal {
    /**
     * Builds the modal content :
     * - Adds input fields for deck name and description ;
     * - Adds a confirm button that triggers deck creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers deck creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @protected
     */
    protected BuildMain(parent: HTMLElement) {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Deck Name Input
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "My cool deck", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        // Deck Description Input
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This deck teaches cool thingies !", null));
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
     * Creates the new deck in the database using the provided form inputs.
     * Closes the modal once the deck is created.
     * @param database - The LokiJS database instance.
     * @param nameInput - Deck name input element.
     * @param descriptionInput - Deck description input element.
     * @protected
     */
    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        Deck.Create(database, nameInput.value, descriptionInput.value);
        this.close();
    }
}