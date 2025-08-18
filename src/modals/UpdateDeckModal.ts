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

export class UpdateDeckModal extends Modal {
    modalOptions: I_ModalOptions;
    deckToUpdate: Deck;

    constructor(app: App, modalOptions: I_ModalOptions, deckToUpdate: Deck) {
        super(app);
        this.modalOptions = modalOptions;
        this.deckToUpdate = deckToUpdate;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main, this.deckToUpdate);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    protected BuildMain(parent: HTMLElement, deckToUpdate: Deck) {
        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General Information");
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My cool deck", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = deckToUpdate.name;

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This deck teaches cool thingies !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        if (deckToUpdate) {
            descriptionInput.value = deckToUpdate.description;
        }

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, nameInput, descriptionInput);
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, nameInput, descriptionInput);
            }
        });
    }

    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let partialDeck: Partial<Deck> = {};
        partialDeck.name = nameInput.value;
        partialDeck.description = descriptionInput.value;
        Deck.Update(database, this.deckToUpdate.id, partialDeck);
        this.close();
    }
}