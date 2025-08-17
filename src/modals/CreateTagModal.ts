import {FlashcardsModal} from "./FlashcardsModal";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import Loki from "lokijs";

export class CreateTagModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement) {
        CreateSubtitle(parent, "General Information");
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My amazing tag", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This tag is tagging cool notes !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(parent, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        const confirmButton: ButtonComponent = CreateButton(parent, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
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
        Tag.Create(database, nameInput.value, descriptionInput.value);
        this.close();
    }
}