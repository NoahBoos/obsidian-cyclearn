import {ButtonComponent, ItemView, WorkspaceLeaf} from "obsidian";
import Flashcards from "../main";
import {CreateAside, CreateContainer,  CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {Note} from "../objects/Note";
import {Deck} from "../objects/Deck";
import {Card} from "../objects/Card";
import {TaggedNote} from "../objects/TaggedNote";
import {Template} from "../objects/Template";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {CreateButton} from "../utils/U_CreateButtonElements";

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
        return "Flashcards Studio View";
    }

    getIcon(): string {
        return "layers";
    }

    async onOpen() {
        const container: Element = this.containerEl.children[1];
        container.empty();

        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        const tagTable: Tag[] = Tag.ReadAll(database);

        // Header Code
        const header: HTMLElement = CreateHeader(container);
        CreateTitle(header, "Flashcards Studio View");

        // Aside & Main Wrapper
        const contentWrapper: HTMLDivElement = CreateContainer(container, ["flashcards--flex-row"]);
        const aside: HTMLElement = CreateAside(contentWrapper, ["flashcards--width-20", "flashcards--flex-column", "flashcards--gap-16"]);
        const main: HTMLElement = CreateMain(contentWrapper, ["flashcards--width-80"]);
        /// Aside Code
        //// Global Filter Code
        CreateSubtitle(aside, "Global Filters");
        const globalFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
        const noteReadAllButton: ButtonComponent = CreateButton(globalFilterWrapper, false, "See all notes", null, ["flashcards--width-100", "flashcards--justify-start"]);
        noteReadAllButton.onClick(() => {
            this.DisplayNoteTable(Note.ReadAll(database), main);
        });
        const deckReadAllButton: ButtonComponent = CreateButton(globalFilterWrapper, false, "See all decks", null, ["flashcards--width-100", "flashcards--justify-start"]);
        deckReadAllButton.onClick(() => {
            this.DisplayDeckTable(Deck.ReadAll(database), main);
        });
        const templateReadAllButton: ButtonComponent = CreateButton(globalFilterWrapper, false, "See all templates", null, ["flashcards--width-100", "flashcards--justify-start"]);
        templateReadAllButton.onClick(() => {
            this.DisplayTemplateTable(Template.ReadAll(database), main);
        });
        const tagReadAllButton: ButtonComponent = CreateButton(globalFilterWrapper, false, "See all tags", null, ["flashcards--width-100", "flashcards--justify-start"]);
        tagReadAllButton.onClick(() => {
            this.DisplayTagTable(Tag.ReadAll(database), main);
        });
        //// Deck Filter Code
        CreateSubtitle(aside, "Deck Filters");
        const deckFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
        deckTable.forEach((deck: Deck) => {
            const createdButton: ButtonComponent = CreateButton(deckFilterWrapper, false, deck.name, null, ["flashcards--width-100", "flashcards--justify-start"]);
            createdButton.onClick(() => {
                this.DisplayNoteTable(Note.ReadAllByDeck(database, deck.id), main);
            });
        })
        //// Template Filter Code
        CreateSubtitle(aside, "Template Filters");
        const templateFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
        templateTable.forEach((template: Template) => {
            const createdButton: ButtonComponent = CreateButton(templateFilterWrapper, false, template.name, null, ["flashcards--width-100", "flashcards--justify-start"]);
            createdButton.onClick(() => {
                this.DisplayNoteTable(Note.ReadAllByTemplate(database, template.id), main);
            });
        })
        //// Tag Filter Code
        CreateSubtitle(aside, "Tag Filters");
        const tagFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
        tagTable.forEach((tag: Tag) => {
            CreateButton(tagFilterWrapper, false, tag.name, null, ["flashcards--width-100", "flashcards--justify-start"]);
        })
    }

    async onClose() {

    }

    DisplayNoteTable(noteTable: Note[], parent: HTMLElement) {
        parent.empty();
    }

    DisplayDeckTable(deckTable: Deck[], parent: HTMLElement) {
        parent.empty();
    }

    DisplayTemplateTable(templateTable: Template[], parent: HTMLElement) {
        parent.empty();
    }

    DisplayTagTable(tagTable: Tag[], parent: HTMLElement) {
        parent.empty();
    }
}