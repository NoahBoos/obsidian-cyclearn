import {FlashcardsModal} from "./FlashcardsModal";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";

export class CreateTagModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement) {
        CreateSubtitle(parent, "General Information", ["flashcards__heading--text-align-left"]);
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My amazing tag", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This tag is tagging cool notes !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        const confirmButton: ButtonComponent = CreateButton(parent, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            Tag.Create(database, nameInput.value, descriptionInput.value);
            this.close();
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
           if (event.shiftKey && event.key === "Enter") {
               event.preventDefault();
               Tag.Create(database, nameInput.value, descriptionInput.value);
               this.close();
           }
        });
    }
}