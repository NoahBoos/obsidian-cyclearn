import {ButtonComponent, ItemView, WorkspaceLeaf} from "obsidian";
import Flashcards from "../main";
import {CreateContainer,  CreateHeader, CreateMain} from "../utils/U_CreateSemanticElements";
import {database} from "../database/Database";
import {Note} from "../objects/Note";
import {Deck} from "../objects/Deck";
import {Card} from "../objects/Card";
import {CreateParagraph, CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {CreateNoteModal} from "../modals/CreateNoteModal";
import {
    CREATE_DECK_MODAL_OPTIONS,
    CREATE_NOTE_MODAL_OPTIONS,
    CREATE_TAG_MODAL_OPTIONS,
    CREATE_TEMPLATE_MODAL_OPTIONS,
} from "../modals/I_ModalOptions";
import {CreateDeckModal} from "../modals/CreateDeckModal";
import {CreateTemplateModal} from "../modals/CreateTemplateModal";
import {CreateTagModal} from "../modals/CreateTagModal";
import {CreateListElement, CreateUnorderedList} from "../utils/U_CreateListElements";
import {CreateRule} from "../utils/U_CreateRuleElement";
import {GetToday} from "../utils/U_GenerateDate";
import {FlashcardReviewModal} from "../modals/FlashcardReviewModal";

export const FLASHCARDS_STUDY_VIEW_TYPE = "flashcards-study-view";

export class FlashcardsStudyView extends ItemView {
    plugin: Flashcards;

    constructor(leaf: WorkspaceLeaf, plugin: Flashcards) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return FLASHCARDS_STUDY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Flashcards Study View";
    }

    getIcon(): string {
        return "layers";
    }

    async onOpen() {
        const container: Element = this.containerEl.children[1];
        container.empty();

        // Table Gathering
        const deckTable: Deck[] = Deck.ReadAll(database).sort((a, b) => a.name.localeCompare(b.name));

        // Header Code
        const header: HTMLElement = CreateHeader(container, ["flashcards--margin-bottom-16", "flashcards--flex-column", "flashcards--gap-16"]);
        CreateTitle(header, "Flashcards Study View", ["flashcards--width-fit-content"]);
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
        })

        // Aside & Main Wrapper
        const contentWrapper: HTMLDivElement = CreateContainer(container, ["flashcards--flex-row", "flashcards--gap-32"]);
        // const aside: HTMLElement = CreateAside(contentWrapper, ["flashcards--width-20", "flashcards--flex-column", "flashcards--gap-16"]);
        const main: HTMLElement = CreateMain(contentWrapper, ["flashcards--width-100", "flashcards--justify-start"]);
        const deckWrapper: HTMLElement = CreateUnorderedList(main);
        deckTable.forEach((deck: Deck) => {
            const deckListElement: HTMLElement = CreateListElement(deckWrapper, ["flashcards--width-100", "flashcards--flex-row", "flashcards--align-center", "flashcards--justify-between"]);
            const deckListElementHeader: HTMLDivElement = CreateContainer(deckListElement, ["flashcards--flex-column"]);
            CreateSubtitle(deckListElementHeader, deck.name);
            if (deck.description) {
                deckListElementHeader.classList.add("flashcards--gap-8");
                CreateParagraph(deckListElementHeader, deck.description);
            }
            const deckListElementStatisticContainer: HTMLDivElement = CreateContainer(deckListElement, ["flashcards--flex-column", "flashcards--gap-8"]);
            const deckNotes: Note[] = Note.ReadAllByDeck(database, deck.id);
            const idNotes: string[] = [];
            deckNotes.forEach(note => {
                idNotes.push(note.id);
            })
            const deckCards: Card[] = Card.ReadAllByNotes(database, idNotes);
            CreateParagraph(deckListElementStatisticContainer, "Total de cartes : " + deckCards.length.toString(), ["flashcards--margin-0"]);
            CreateParagraph(deckListElementStatisticContainer, "Nouvelles cartes : " + deckCards.filter(card => card.due_at <= parseInt(GetToday()) && card.review_amount == 0).length, ["flashcards--margin-0"]);
            CreateParagraph(deckListElementStatisticContainer, "Cartes à revoir : " + deckCards.filter(card => card.due_at <= parseInt(GetToday()) && card.review_amount >= 1).length, ["flashcards--margin-0"]);
            const reviewButton: ButtonComponent = CreateButton(deckListElement, false, "Review cards");
            reviewButton.onClick(() => {
                let cardsInSession: Card[] = deckCards.filter(card => card.due_at <= parseInt(GetToday()));
                new FlashcardReviewModal(this.app, cardsInSession).open();
            });
            CreateRule(deckWrapper);
        });
    }

    async onClose() {

    }
}