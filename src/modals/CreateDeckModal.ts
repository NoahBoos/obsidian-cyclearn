import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {InputGroupData} from "../objects/InputGroupData";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {CreateSection} from "../utils/U_CreateSemanticElements";

export class CreateDeckModal extends FlashcardsCreateObjectModal {
    protected BuildMain(parent: HTMLElement) {
        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My cool deck", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This deck teaches cool thingies !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, nameInput, descriptionInput);
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, nameInput, descriptionInput);
            }
        });
    }

    protected ProcessData(database: Loki, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        Deck.Create(database, nameInput.value, descriptionInput.value);
        this.close();
    }
}