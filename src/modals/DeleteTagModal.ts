import {App, ButtonComponent, Modal} from "obsidian";
import {Tag} from "../objects/Tag";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {CreateParagraph, CreateTitle} from "../utils/U_CreateTextualElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";

export class DeleteTagModal extends Modal {
    modalOptions: I_ModalOptions;
    tagToDelete: Tag;

    constructor(app: App, modalOptions: I_ModalOptions, tagToDelete: Tag) {
        super(app);
        this.modalOptions = modalOptions;
        this.tagToDelete = tagToDelete;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        CreateParagraph(main, "Are you sure you want to delete this tag ?");
        const deleteButton: ButtonComponent = CreateButton(main, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        deleteButton.onClick(() => {
            Tag.Delete(database, this.tagToDelete.id);
            this.close();
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Tag.Delete(database, this.tagToDelete.id);
                this.close();
            }
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}