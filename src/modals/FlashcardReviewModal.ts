import {App, ButtonComponent, Modal} from "obsidian";
import {Card} from "../objects/Card";
import {CreateContainer, CreateFooter, CreateMain} from "../utils/U_CreateSemanticElements";
import {Note} from "../objects/Note";
import {database} from "../database/Database";
import {CardType} from "../objects/E_CardType";
import {CreateH3, CreateParagraph, CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {ApplySM2} from "../srs/ApplySM2";
import {Template} from "../objects/Template";
import {CreateRule} from "../utils/U_CreateRuleElement";

export class FlashcardReviewModal extends Modal {
    cardsInSession: Card[];
    cardInReview: Card;
    noteInReview: Note;
    templateInReview: Template;

    constructor(app: App, cardsInSession: Card[]) {
        super(app);
        this.app = app;
        this.cardsInSession = cardsInSession;
        this.cardInReview = cardsInSession[0];
        this.noteInReview = Note.ReadOne(database, this.cardInReview.id_note);
        this.templateInReview = Template.ReadOne(database, this.noteInReview.id_template);
    }

    onOpen() {
        const {contentEl} = this;
        // Main Content Code
        const main: HTMLElement = CreateMain(contentEl);
        this.GenerateFrontContent(main);
        main.lastElementChild.classList.add("flashcards--margin-bottom-0");
        // SEPARATOR
        CreateRule(contentEl);
        // Footer Content Code
        const footer: HTMLElement = CreateFooter(contentEl, ["flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        const revealAnswer: ButtonComponent = CreateButton(footer, true, "Reveal answer");
        let answerRevealed: boolean = false;
        revealAnswer.onClick(() => {
            if (answerRevealed) {
                return;
            }
            const middleCardSeparator: HTMLElement = CreateRule(main, ["flashcards--width-100", "flashcards--margin-vertical-8px"]);
            this.GenerateBackContent(main);
            middleCardSeparator.nextElementSibling.classList.add("flashcards--margin-top-0");
            main.lastElementChild.classList.add("flashcards--margin-bottom-0");
            answerRevealed = true;
        });
        this.contentEl.addEventListener("keydown", (event: KeyboardEvent) => {
            console.log(event.key);
           if (event.key === " ") {
               if (answerRevealed) {
                   return;
               }
               const middleCardSeparator: HTMLElement = CreateRule(main, ["flashcards--width-100", "flashcards--margin-vertical-8px"]);
               this.GenerateBackContent(main);
               middleCardSeparator.nextElementSibling.classList.add("flashcards--margin-top-0");
               main.lastElementChild.classList.add("flashcards--margin-bottom-0");
               answerRevealed = true;
           }
        });
        const gradeButtonContainer: HTMLDivElement = CreateContainer(footer, ["flashcards--flex-row", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16"]);
        const buttonTexts: Array<string> = ["Forgotten", "Hard", "Medium", "Easy", "Perfect"];
        for (let i = 0; i < 5; i++) {
            const button: ButtonComponent = CreateButton(gradeButtonContainer, false, buttonTexts[i], null, ["flashcards--width-15-lock"]);
            button.onClick(() => {
                if (answerRevealed) {
                    if (this.cardsInSession.length > 0) {
                        ApplySM2(this.cardInReview, i);
                        this.cardsInSession.remove(this.cardInReview);
                        this.close();
                        if (this.cardsInSession.length > 0) {
                            new FlashcardReviewModal(this.app, this.cardsInSession).open();
                        }
                    } else {
                        this.close();
                    }
                }
            });
        }
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    GenerateFrontContent(main: HTMLElement) {
        if (this.cardInReview.card_type === CardType.FRONT) {
            for (let frontFieldsKey in this.templateInReview.frontFields) {
                switch (this.templateInReview.frontFields[frontFieldsKey]) {
                    case "h1":
                        CreateTitle(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "h2":
                        CreateSubtitle(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "h3":
                        CreateH3(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "p":
                        CreateParagraph(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                }
            }
        } else if (this.cardInReview.card_type === CardType.BACK) {
            for (let backFieldKey in this.templateInReview.backFields) {
                switch (this.templateInReview.backFields[backFieldKey]) {
                    case "h1":
                        CreateTitle(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "h2":
                        CreateSubtitle(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "h3":
                        CreateH3(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "p":
                        CreateParagraph(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                }
            }
        }
    }

    GenerateBackContent(main: HTMLElement) {
        if (this.cardInReview.card_type === CardType.BACK) {
            for (let frontFieldsKey in this.templateInReview.frontFields) {
                switch (this.templateInReview.frontFields[frontFieldsKey]) {
                    case "h1":
                        CreateTitle(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "h2":
                        CreateSubtitle(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "h3":
                        CreateH3(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                    case "p":
                        CreateParagraph(main, this.noteInReview.frontFields[frontFieldsKey]);
                        break;
                }
            }
        } else if (this.cardInReview.card_type === CardType.FRONT) {
            for (let backFieldKey in this.templateInReview.backFields) {
                switch (this.templateInReview.backFields[backFieldKey]) {
                    case "h1":
                        CreateTitle(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "h2":
                        CreateSubtitle(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "h3":
                        CreateH3(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                    case "p":
                        CreateParagraph(main, this.noteInReview.backFields[backFieldKey]);
                        break;
                }
            }
        }
    }
}