import {CreateContainer, CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInput, CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, DropdownComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";
import {CreateDropdown, CreateOptionsForDropdownFromRecord} from "../utils/U_CreateDropdownElements";
import {AUTHORIZED_ELEMENT_TYPES} from "../utils/U_AuthorizedElementTypes";
import {Template} from "../objects/Template";

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
        const nameInputGroupData: InputGroupData = new InputGroupData("text", "Name", "A wonderful template", null);
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, nameInputGroupData);
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = templateToUpdate.name;

        const descriptionInputGroupData: InputGroupData = new InputGroupData("text", "Description", "This template is templating !", null);
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, descriptionInputGroupData);
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        if (templateToUpdate.description) {
            descriptionInput.value = templateToUpdate.description;
        }

        // Field Information Container Code
        const fieldInformationContainer: HTMLElement = CreateSection(parent);
        const fieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(fieldHeader, "Fields", ["flashcards--width-fit-content"]);
        const addFieldButton: ButtonComponent = CreateButton(fieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const fieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        for (let fieldsKey in templateToUpdate.fields) {
            const fieldInputGroupContainer: HTMLDivElement = CreateContainer(fieldContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
            const fieldInput: HTMLInputElement = CreateInput(fieldInputGroupContainer, "text", "A cool field", null, ["flashcards--width-100"]);
            fieldInput.value = fieldsKey;
            const fieldSelector: DropdownComponent = CreateDropdown(fieldInputGroupContainer, "No type selected", ["flashcards--width-fit-content"]);
            CreateOptionsForDropdownFromRecord(fieldSelector, AUTHORIZED_ELEMENT_TYPES);
            fieldSelector.setValue(templateToUpdate.fields[fieldsKey]);
        }
        addFieldButton.onClick(async () => {
            const fieldInputGroupContainer: HTMLDivElement = CreateContainer(fieldContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
            const fieldInput: HTMLInputElement = CreateInput(fieldInputGroupContainer, "text", "A cool field", null, ["flashcards--width-100"]);
            const fieldSelector: DropdownComponent = CreateDropdown(fieldInputGroupContainer, "No type selected", ["flashcards--width-fit-content"]);
            CreateOptionsForDropdownFromRecord(fieldSelector, AUTHORIZED_ELEMENT_TYPES);
        });

        // Submit Container & Data Treatment Code
        const submitContainer: HTMLElement = CreateSection(parent);
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, fieldContainer, nameInput, descriptionInput);
        });
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, fieldContainer, nameInput, descriptionInput);
            }
        });
    }

    protected ProcessData(database: Loki, fieldContainer?: HTMLDivElement, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement) {
        let fields: Record<string, string> = {};
        for (const field of fieldContainer.querySelectorAll("div")) {
            let fieldInput: HTMLInputElement = field.querySelector("input");
            let fieldSelector: HTMLSelectElement = field.querySelector("select");
            fields[fieldInput.value] = fieldSelector.value;
        }
        let partialTemplate: Partial<Template> = {};
        partialTemplate.name = nameInput.value;
        partialTemplate.description = descriptionInput.value;
        partialTemplate.fields = fields;
        Template.Update(database, this.templateToUpdate.id, partialTemplate);
        this.close();
    }
}