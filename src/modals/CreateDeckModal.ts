import {FlashcardsModal} from "./FlashcardsModal";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {InputGroupData} from "../objects/InputGroupData";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Deck} from "../objects/Deck";

export class CreateDeckModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement) {
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My cool deck", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This deck teaches cool thingies !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        const confirmButton: ButtonComponent = CreateButton(parent, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            Deck.Create(database, nameInput.value, descriptionInput.value);
            this.close();
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                Deck.Create(database, nameInput.value, descriptionInput.value);
                this.close();
            }
        });
    }
}