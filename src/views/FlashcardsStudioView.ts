import {ItemView, WorkspaceLeaf} from "obsidian";
import Flashcards from "../main";
import {CreateAside, CreateContainer, CreateFooter, CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";

export const FLASHCARDS_STUDIO_VIEW_TYPE = "flashcards-studio-view";
let activeView: string = "flashcards--read-all";

export class FlashcardsStudioView extends ItemView {
    plugin: Flashcards;

    constructor(leaf: WorkspaceLeaf, plugin: Flashcards) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return FLASHCARDS_STUDIO_VIEW_TYPE;
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
    }

    async onClose() {

    }
}