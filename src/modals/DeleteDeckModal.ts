import {App, ButtonComponent, Modal} from "obsidian";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {CreateParagraph, CreateTitle} from "../utils/U_CreateTextualElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";

export class DeleteDeckModal extends Modal {
    modalOptions: I_ModalOptions;
    deckToDelete: Deck;

    constructor(app: App, modalOptions: I_ModalOptions, deckToDelete: Deck) {
        super(app);
        this.modalOptions = modalOptions;
        this.deckToDelete = deckToDelete;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        CreateParagraph(main, "Are you sure you want to delete this deck ?");
        const deleteButton: ButtonComponent = CreateButton(main, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        deleteButton.onClick(() => {
            Deck.Delete(database, this.deckToDelete.id);
            this.close();
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Deck.Delete(database, this.deckToDelete.id);
                this.close();
            }
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}