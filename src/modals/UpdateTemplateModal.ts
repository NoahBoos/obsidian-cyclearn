import {CreateContainer, CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInput, CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, DropdownComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";
import {Template} from "../objects/Template";
import {BuildFieldRecord, GenerateTemplateFieldInputGroupContainer} from "../utils/U_FlashcardsDataTreatmentUtils";

export class UpdateTemplateModal extends Modal {
    modalOptions: I_ModalOptions;
    templateToUpdate: Template;

    constructor(app: App, modalOptions: I_ModalOptions, templateToUpdate: Template) {
        super(app);
        this.modalOptions = modalOptions;
        this.templateToUpdate = templateToUpdate;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        const title = CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main, this.templateToUpdate);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    protected BuildMain(parent: HTMLElement, templateToUpdate: Template): void {
        // General Information Container Code
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "A wonderful template", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = templateToUpdate.name;

        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This template is templating !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        if (templateToUpdate.description) {
            descriptionInput.value = templateToUpdate.description;
        }

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        /// Front Field Container Code
        const frontFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(frontFieldHeader, "Front fields", ["flashcards--width-fit-content"]);
        const addFrontFieldButton: ButtonComponent = CreateButton(frontFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        for (let fieldsKey in templateToUpdate.frontFields) {
            const fieldInputGroupContainer: HTMLDivElement = GenerateTemplateFieldInputGroupContainer(frontFieldContainer);
            const fieldInput: HTMLInputElement = fieldInputGroupContainer.querySelector("input");
            fieldInput.value = fieldsKey;
            const fieldSelector: HTMLSelectElement = fieldInputGroupContainer.querySelector("select");
            fieldSelector.value = templateToUpdate.frontFields[fieldsKey];
        }
        addFrontFieldButton.onClick(async () => {
            GenerateTemplateFieldInputGroupContainer(frontFieldContainer);
        });
        /// Back Field Container Code
        const backFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(backFieldHeader, "Back fields", ["flashcards--width-fit-content"]);
        const addBackFieldButton: ButtonComponent = CreateButton(backFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const backFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        for (let fieldsKey in templateToUpdate.backFields) {
            const fieldInputGroupContainer: HTMLDivElement = GenerateTemplateFieldInputGroupContainer(backFieldContainer);
            const fieldInput: HTMLInputElement = fieldInputGroupContainer.querySelector("input");
            fieldInput.value = fieldsKey;
            const fieldSelector: HTMLSelectElement = fieldInputGroupContainer.querySelector("select");
            fieldSelector.value = templateToUpdate.backFields[fieldsKey];
        }
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
        let partialTemplate: Partial<Template> = {};
        partialTemplate.name = nameInput.value;
        partialTemplate.description = descriptionInput.value;
        partialTemplate.frontFields = frontFields;
        partialTemplate.backFields = backFields;
        Template.Update(database, this.templateToUpdate.id, partialTemplate);
        this.close();
    }
}