import {ItemView, WorkspaceLeaf} from "obsidian";
import Flashcards from "../main";
import {CreateAside, CreateContainer, CreateFooter, CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";

export const VT_FLASHCARDS_VIEW_TYPE = "flashcards-view";


export class V_FlashcardsView extends ItemView {
    plugin: Flashcards;

    constructor(leaf: WorkspaceLeaf, plugin: Flashcards) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VT_FLASHCARDS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Flashcards";
    }

    getIcon(): string {
        return "layers";
    }

    async onOpen() {
        const container: Element = this.containerEl.children[1];
        container.empty();

        const header: HTMLElement = CreateHeader(container);
        const contentWrapper: HTMLDivElement = CreateContainer(container);
        const aside: HTMLElement = CreateAside(contentWrapper);
        const main: HTMLElement = CreateMain(contentWrapper);
        const footer: HTMLElement = CreateFooter(container);
    }

    async onClose() {

    }
}