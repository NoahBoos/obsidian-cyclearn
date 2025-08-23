import {FlashcardsCreateObjectModal} from "./FlashcardsCreateObjectModal";
import {ButtonComponent} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {Template} from "../objects/Template";
import {database} from "../database/Database";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {CreateSubtitle} from "../utils/U_CreateTextualElements";
import {CreateContainer, CreateSection} from "../utils/U_CreateSemanticElements";
import Loki from "lokijs";
import {BuildFieldRecord, GenerateTemplateFieldInputGroupContainer} from "../utils/U_FlashcardsDataTreatmentUtils";

export class CreateTemplateModal extends FlashcardsCreateObjectModal {
    protected BuildMain(parent: HTMLElement): void {
        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "A wonderful template", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");

        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This template is templating !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        /// Front Field Container Code
        const frontFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(frontFieldHeader, "Front fields", ["flashcards--width-fit-content"]);
        const addFrontFieldButton: ButtonComponent = CreateButton(frontFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        addFrontFieldButton.onClick(async () => {
           GenerateTemplateFieldInputGroupContainer(frontFieldContainer);
        });
        /// Back Field Container Code
        const backFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(backFieldHeader, "Back fields", ["flashcards--width-fit-content"]);
        const addBackFieldButton: ButtonComponent = CreateButton(backFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        addBackFieldButton.onClick(async () => {
            GenerateTemplateFieldInputGroupContainer(backFieldContainer);
        });

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput);
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput);
            }
        });
    }

    protected ProcessData(database: Loki, frontFieldContainer?: HTMLDivElement, backFieldContainer?: HTMLDivElement, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let frontFields: Record<string, string> = BuildFieldRecord(frontFieldContainer);
        let backFields: Record<string, string> = BuildFieldRecord(backFieldContainer);
        Template.Create(database, nameInput.value, descriptionInput.value, frontFields, backFields);
        this.close();
    }
}