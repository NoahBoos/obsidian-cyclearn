import {App, Modal} from "obsidian";
import {CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateTitle} from "../utils/U_CreateTextualElements";

export abstract class FlashcardsModal extends Modal {
    modalOptions: I_ModalOptions;

    constructor(app: App, modalOptions: I_ModalOptions) {
        super(app);
        this.modalOptions = modalOptions;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards__modal");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    protected abstract BuildMain(parent: HTMLElement): void;

    protected abstract ProcessData(database: Loki): void;
}