import {App, ButtonComponent, Modal} from "obsidian";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {CreateParagraph, CreateTitle} from "../utils/U_CreateTextualElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import {Note} from "../objects/Note";
import {Card} from "../objects/Card";

export class DeleteNoteModal extends Modal {
    modalOptions: I_ModalOptions;
    noteToDelete: Note;

    constructor(app: App, modalOptions: I_ModalOptions, noteToDelete: Note) {
        super(app);
        this.modalOptions = modalOptions;
        this.noteToDelete = noteToDelete;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        CreateParagraph(main, "Are you sure you want to delete this note and its related cards ?");
        const relatedCards: Card[] = Card.ReadAllByNote(database, this.noteToDelete.id);
        const deleteButton: ButtonComponent = CreateButton(main, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        deleteButton.onClick(() => {
            Note.Delete(database, this.noteToDelete.id);
            relatedCards.forEach((card: Card) => {
                Card.Delete(database, card.id);
            })
            this.close();
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Note.Delete(database, this.noteToDelete.id);
                relatedCards.forEach((card: Card) => {
                    Card.Delete(database, card.id);
                })
                this.close();
            }
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}