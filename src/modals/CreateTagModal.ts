import {FlashcardsModal} from "./FlashcardsModal";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {ButtonComponent} from "obsidian";
import {database} from "../database/Database";
import {Tag} from "../objects/Tag";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import Loki from "lokijs";
import {CreateSection} from "../utils/U_CreateSemanticElements";

export class CreateTagModal extends FlashcardsModal {
    protected BuildMain(parent: HTMLElement) {
        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General Information");
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "My amazing tag", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This tag is tagging cool notes !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(fieldInformationContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
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