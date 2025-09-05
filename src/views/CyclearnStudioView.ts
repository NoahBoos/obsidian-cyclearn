import {ButtonComponent, DropdownComponent, ItemView, WorkspaceLeaf} from "obsidian";
import Cyclearn from "../main";
import {CreateAside, CreateContainer, CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {Note} from "../objects/Note";
import {Deck} from "../objects/Deck";
import {Card} from "../objects/Card";
import {Template} from "../objects/Template";
import {CreateH3, CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {CreateTable, CreateTableHeader, CreateTableRow} from "../utils/U_CreateTableElements";
import {CreateNoteModal} from "../modals/CreateNoteModal";
import {
    CREATE_DECK_MODAL_OPTIONS,
    CREATE_NOTE_MODAL_OPTIONS,
    CREATE_TAG_MODAL_OPTIONS,
    CREATE_TEMPLATE_MODAL_OPTIONS,
    DELETE_DECK_MODAL_OPTIONS,
    DELETE_NOTE_MODAL_OPTIONS,
    DELETE_TAG_MODAL_OPTIONS,
    DELETE_TEMPLATE_MODAL_OPTIONS,
    UPDATE_DECK_MODAL_OPTIONS,
    UPDATE_NOTE_MODAL_OPTIONS,
    UPDATE_TAG_MODAL_OPTIONS,
    UPDATE_TEMPLATE_MODAL_OPTIONS
} from "../modals/I_ModalOptions";
import {CreateDeckModal} from "../modals/CreateDeckModal";
import {CreateTemplateModal} from "../modals/CreateTemplateModal";
import {CreateTagModal} from "../modals/CreateTagModal";
import {UpdateNoteModal} from "../modals/UpdateNoteModal";
import {UpdateDeckModal} from "../modals/UpdateDeckModal";
import {UpdateTemplateModal} from "../modals/UpdateTemplateModal";
import {UpdateTagModal} from "../modals/UpdateTagModal";
import {DeleteTagModal} from "../modals/DeleteTagModal";
import {DeleteTemplateModal} from "../modals/DeleteTemplateModal";
import {DeleteDeckModal} from "../modals/DeleteDeckModal";
import {DeleteNoteModal} from "../modals/DeleteNoteModal";
import {CreateDropdown, CreateOptionsForDropdownFromTable} from "../utils/U_CreateDropdownElements";
import {TaggedNote} from "../objects/TaggedNote";

export const CYCLEARN_STUDIO_VIEW_TYPE = "cyclearn-studio-view";

export class CyclearnStudioView extends ItemView {
    plugin: Cyclearn;

    constructor(leaf: WorkspaceLeaf, plugin: Cyclearn) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return CYCLEARN_STUDIO_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Cyclearn Studio View";
    }

    getIcon(): string {
        return "layers";
    }

    async onOpen() {
        const container: Element = this.containerEl.children[1];
        container.empty();

        // Table Gathering
        const noteTable: Note[] = Note.ReadAll(database);
        const deckTable: Deck[] = Deck.ReadAll(database);
        const templateTable: Template[] = Template.ReadAll(database);
        const tagTable: Tag[] = Tag.ReadAll(database);
        const taggedNotesTable: TaggedNote[] = TaggedNote.ReadAll(database);

        // Header Code
        const header: HTMLElement = CreateHeader(container, ["flashcards--margin-bottom-16", "flashcards--flex-column", "flashcards--gap-16"]);
        CreateTitle(header, "Cyclearn Studio View", ["flashcards--width-fit-content"]);
        const headerButtonContainer: HTMLDivElement = CreateContainer(header, ["flashcards--flex-row", "flashcards--justify-center", "flashcards--gap-16"]);
        const newNoteButton: ButtonComponent = CreateButton(headerButtonContainer, true, "New note", null, ["flashcards--width-fit-content"]);
        newNoteButton.onClick(() => {
           new CreateNoteModal(this.app, CREATE_NOTE_MODAL_OPTIONS).open();
        });
        const newDeckButton: ButtonComponent = CreateButton(headerButtonContainer, true, "New deck", null, ["flashcards--width-fit-content"]);
        newDeckButton.onClick(() => {
            new CreateDeckModal(this.app, CREATE_DECK_MODAL_OPTIONS).open();
        });
        const newTemplateButton: ButtonComponent = CreateButton(headerButtonContainer, true, "New template", null, ["flashcards--width-fit-content"]);
        newTemplateButton.onClick(() => {
           new CreateTemplateModal(this.app, CREATE_TEMPLATE_MODAL_OPTIONS).open();
        });
        const newTagButton: ButtonComponent = CreateButton(headerButtonContainer, true, "New tag", null, ["flashcards--width-fit-content"]);
        newTagButton.onClick(() => {
            new CreateTagModal(this.app, CREATE_TAG_MODAL_OPTIONS).open();
        });

        // Aside & Main Wrapper
        const contentWrapper: HTMLDivElement = CreateContainer(container, ["flashcards--flex-row", "flashcards--gap-32"]);
        const aside: HTMLElement = CreateAside(contentWrapper, ["flashcards--width-20", "flashcards--flex-column", "flashcards--gap-16"]);
        const main: HTMLElement = CreateMain(contentWrapper, ["flashcards--width-80", "flashcards--justify-start"]);

        //// Global Filter Code
        CreateSubtitle(aside, "Global filters");
        const globalFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
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
        const cardReadAllButton: ButtonComponent = CreateButton(globalFilterWrapper, false, "See all cards (Not the notes)", null, ["flashcards--width-100", "flashcards--justify-start"]);
        cardReadAllButton.onClick(() => {
            this.DisplayCardTable(Card.ReadAll(database), main);
        })

        CreateSubtitle(aside, "Note filters");
        const noteReadAllButton: ButtonComponent = CreateButton(aside, false, "See all notes", null, ["flashcards--width-100", "flashcards--justify-start"]);
        noteReadAllButton.onClick(() => {
            this.DisplayNoteTable(Note.ReadAll(database), main, "All notes");
        });
        CreateH3(aside, "Dynamic note filters")
        let selectedDeckID: string = "default";
        const noteFilterWrapper: HTMLDivElement = CreateContainer(aside, ["flashcards--flex-column", "flashcards--gap-8"]);
        const deckSelector: DropdownComponent = CreateDropdown(noteFilterWrapper, "All deck");
        CreateOptionsForDropdownFromTable(deckSelector, deckTable);
        deckSelector.onChange((deckID: string) => {
            selectedDeckID = deckID;
            this.DisplayNoteTable(this.FilterDataToDisplay(noteTable, taggedNotesTable, selectedDeckID, selectedTemplateID, selectedTagID), main, "Notes");
        });
        let selectedTemplateID: string = "default";
        const templateSelector: DropdownComponent = CreateDropdown(noteFilterWrapper, "All template");
        CreateOptionsForDropdownFromTable(templateSelector, templateTable);
        templateSelector.onChange((templateID: string) => {
            selectedTemplateID = templateID;
            this.DisplayNoteTable(this.FilterDataToDisplay(noteTable, taggedNotesTable, selectedDeckID, selectedTemplateID, selectedTagID), main, "Notes");
        });
        let selectedTagID: string = "default";
        const tagSelector: DropdownComponent = CreateDropdown(noteFilterWrapper, "All tags");
        // tagSelector.selectEl.multiple = true;
        CreateOptionsForDropdownFromTable(tagSelector, tagTable);
        tagSelector.onChange((tagID: string) => {
            selectedTagID = tagID;
            this.DisplayNoteTable(this.FilterDataToDisplay(noteTable, taggedNotesTable, selectedDeckID, selectedTemplateID, selectedTagID), main, "Notes");
        });
    }

    async onClose() {

    }

    // TODO - TAGS
    FilterDataToDisplay(notes: Note[], taggedNotes: TaggedNote[], deckID: string, templateID: string, tagID: string) {
        return notes.filter(note =>
            (deckID === "default" || note.id_deck === deckID) &&
            (templateID === "default" || note.id_template === templateID)
        );
    }

    DisplayNoteTable(noteTable: Note[], parent: HTMLElement, title: string) {
        parent.empty();
        CreateSubtitle(parent, title);
        const table: HTMLTableElement = CreateTable(parent);
        const tableHeader: HTMLTableRowElement = CreateTableHeader(table, ["Actions", "Main Field", "Deck", "Template"]);
        const cells: NodeListOf<HTMLTableCellElement> = tableHeader.querySelectorAll("th");
        cells[0].classList.add("flashcards--width-15-lock");
        cells[1].classList.add("flashcards--width-25-lock");
        cells[2].classList.add("flashcards--width-25-lock");
        cells[3].classList.add("flashcards--width-35-lock");
        noteTable.forEach((note: Note) => {
            const usedDeck: Deck = Deck.ReadOne(database, note.id_deck);
            const usedTemplate: Template = Template.ReadOne(database, note.id_template);
            let mainFieldValue: string;
            for (let frontFieldsKey in note.frontFields) {
                if (frontFieldsKey == usedTemplate.mainField) {
                    mainFieldValue = note.frontFields[frontFieldsKey];
                }
            }
            const tableRow: HTMLTableRowElement = CreateTableRow(table, ["", mainFieldValue, usedDeck.name, usedTemplate.name])
            const firstCell: HTMLTableCellElement = tableRow.querySelector("td");
            const deleteButton: ButtonComponent = CreateButton(firstCell, true, null, "x", ["flashcards--width-fit-content", "flashcards--margin-right-8"]);
            deleteButton.onClick(() => {
                new DeleteNoteModal(this.app, DELETE_NOTE_MODAL_OPTIONS, note).open();
            });
            const editButton: ButtonComponent =  CreateButton(firstCell, true, null, "pencil", ["flashcards--width-fit-content"]);
            editButton.onClick(() => {
                new UpdateNoteModal(this.app, UPDATE_NOTE_MODAL_OPTIONS, note).open();
            });
            const cells: NodeListOf<HTMLTableCellElement> = tableRow.querySelectorAll("td");
            cells[0].classList.add("flashcards--width-15-lock");
            cells[1].classList.add("flashcards--width-25-lock");
            cells[2].classList.add("flashcards--width-25-lock");
            cells[3].classList.add("flashcards--width-35-lock");
        });
    }

    DisplayCardTable(cardTable: Card[], parent: HTMLElement) {
        parent.empty();
        CreateSubtitle(parent, "All cards");
        const table: HTMLTableElement = CreateTable(parent);
        const tableHeader: HTMLTableRowElement = CreateTableHeader(table, ["Related note ID", "Due at", "Type"]);
        const cells: NodeListOf<HTMLTableCellElement> = tableHeader.querySelectorAll("th");
        cells[0].classList.add("flashcards--width-30-lock");
        cells[1].classList.add("flashcards--width-35-lock");
        cells[2].classList.add("flashcards--width-35-lock");
        cardTable.forEach((card: Card) => {
            const tableRow: HTMLTableRowElement = CreateTableRow(table, [card.id_note, (card.due_at ?? "Next review").toString(), card.card_type]);
            const cells: NodeListOf<HTMLTableCellElement> = tableRow.querySelectorAll("td");
            cells[0].classList.add("flashcards--width-30-lock");
            cells[1].classList.add("flashcards--width-35-lock");
            cells[2].classList.add("flashcards--width-35-lock");
        });
    }

    DisplayDeckTable(deckTable: Deck[], parent: HTMLElement) {
        parent.empty();
        CreateSubtitle(parent, "All decks");
        const table: HTMLTableElement = CreateTable(parent);
        const tableHeader: HTMLTableRowElement = CreateTableHeader(table, ["Actions", "Name", "Description"]);
        const cells: NodeListOf<HTMLTableCellElement> = tableHeader.querySelectorAll("th");
        cells[0].classList.add("flashcards--width-15-lock");
        cells[1].classList.add("flashcards--width-30-lock");
        cells[2].classList.add("flashcards--width-55-lock");
        deckTable.forEach((deck: Deck) => {
            const tableRow: HTMLTableRowElement = CreateTableRow(table, ["", deck.name, deck.description]);
            const firstCell: HTMLTableCellElement = tableRow.querySelector("td");
            const deleteButton: ButtonComponent = CreateButton(firstCell, true, null, "x", ["flashcards--width-fit-content", "flashcards--margin-right-8"]);
            deleteButton.onClick(() => {
                new DeleteDeckModal(this.app, DELETE_DECK_MODAL_OPTIONS, deck).open();
            });
            const editButton: ButtonComponent =  CreateButton(firstCell, true, null, "pencil", ["flashcards--width-fit-content"]);
            editButton.onClick(() => {
                new UpdateDeckModal(this.app, UPDATE_DECK_MODAL_OPTIONS, deck).open();
            });
            const cells: NodeListOf<HTMLTableCellElement> = tableRow.querySelectorAll("td");
            cells[0].classList.add("flashcards--width-15-lock");
            cells[1].classList.add("flashcards--width-30-lock");
            cells[2].classList.add("flashcards--width-55-lock");
        });
    }

    DisplayTemplateTable(templateTable: Template[], parent: HTMLElement) {
        parent.empty();
        CreateSubtitle(parent, "All templates");
        const table: HTMLTableElement = CreateTable(parent);
        const tableHeader: HTMLTableRowElement = CreateTableHeader(table, ["Actions", "Name", "Description"]);
        const cells: NodeListOf<HTMLTableCellElement> = tableHeader.querySelectorAll("th");
        cells[0].classList.add("flashcards--width-15-lock");
        cells[1].classList.add("flashcards--width-30-lock");
        cells[2].classList.add("flashcards--width-55-lock");
        templateTable.forEach((template: Template) => {
            const tableRow: HTMLTableRowElement = CreateTableRow(table, ["", template.name, template.description]);
            const firstCell: HTMLTableCellElement = tableRow.querySelector("td");
            const deleteButton: ButtonComponent = CreateButton(firstCell, true, null, "x", ["flashcards--width-fit-content", "flashcards--margin-right-8"]);
            deleteButton.onClick(() => {
                new DeleteTemplateModal(this.app, DELETE_TEMPLATE_MODAL_OPTIONS, template).open();
            });
            const editButton: ButtonComponent =  CreateButton(firstCell, true, null, "pencil", ["flashcards--width-fit-content"]);
            editButton.onClick(() => {
                new UpdateTemplateModal(this.app, UPDATE_TEMPLATE_MODAL_OPTIONS, template).open();
            });
            const cells: NodeListOf<HTMLTableCellElement> = tableRow.querySelectorAll("td");
            cells[0].classList.add("flashcards--width-15-lock");
            cells[1].classList.add("flashcards--width-30-lock");
            cells[2].classList.add("flashcards--width-55-lock");
        });
    }

    DisplayTagTable(tagTable: Tag[], parent: HTMLElement) {
        parent.empty();
        CreateSubtitle(parent, "All tags");
        const table: HTMLTableElement = CreateTable(parent);
        const tableHeader: HTMLTableRowElement = CreateTableHeader(table, ["Actions", "Name", "Description"]);
        const cells: NodeListOf<HTMLTableCellElement> = tableHeader.querySelectorAll("th");
        cells[0].classList.add("flashcards--width-15-lock");
        cells[1].classList.add("flashcards--width-30-lock");
        cells[2].classList.add("flashcards--width-55-lock");
        tagTable.forEach((tag: Tag) => {
            const tableRow: HTMLTableRowElement = CreateTableRow(table, ["", tag.name, tag.description]);
            const firstCell: HTMLTableCellElement = tableRow.querySelector("td");
            const deleteButton: ButtonComponent = CreateButton(firstCell, true, null, "x", ["flashcards--width-fit-content", "flashcards--margin-right-8"]);
            deleteButton.onClick(() => {
                new DeleteTagModal(this.app, DELETE_TAG_MODAL_OPTIONS, tag).open();
            });
            const editButton: ButtonComponent =  CreateButton(firstCell, true, null, "pencil", ["flashcards--width-fit-content"]);
            editButton.onClick(() => {
                new UpdateTagModal(this.app, UPDATE_TAG_MODAL_OPTIONS, tag).open();
            });
            const cells: NodeListOf<HTMLTableCellElement> = tableRow.querySelectorAll("td");
            cells[0].classList.add("flashcards--width-15-lock");
            cells[1].classList.add("flashcards--width-30-lock");
            cells[2].classList.add("flashcards--width-55-lock");
        });
    }
}