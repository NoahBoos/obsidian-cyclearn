import {CreateContainer, CreateHeader, CreateMain, CreateSection} from "../utils/U_CreateSemanticElements";
import {CreateSubtitle, CreateTitle} from "../utils/U_CreateTextualElements";
import {InputGroupData} from "../objects/InputGroupData";
import {CreateInputGroup} from "../utils/U_CreateInputElements";
import {App, ButtonComponent, DropdownComponent, Modal} from "obsidian";
import {CreateButton} from "../utils/U_CreateButtonElements";
import {database} from "../database/Database";
import Loki from "lokijs";
import {I_ModalOptions} from "./I_ModalOptions";
import {Template} from "../objects/Template";
import {BuildFieldRecord, GenerateTemplateFieldInputGroupContainer} from "../utils/U_FlashcardsDataTreatmentUtils";
import {CreateDropdown} from "../utils/U_CreateDropdownElements";

/**
 * Modal for updating a Cyclearn template.
 *
 * Provides a prefilled form with :
 * - An input field for the template name ;
 * - An input field for the template description ;
 * - Two dynamic sub-forms containing input field and dropdown usable to add a new field to the front or the back of the template fields ;
 * - A confirm button and a keyboard shortcut (SHIFT + ENTER) following both the same logic.

 * On confirmation, the template is updated in the database and the modal closes.
 */
export class UpdateTemplateModal extends Modal {
    /**
     * Options used to configure the modal.
     */
    modalOptions: I_ModalOptions;
    /**
     * The template to update.
     */
    templateToUpdate: Template;

    /**
     * Creates a new modal.
     * @param app - Obsidian application instance.
     * @param modalOptions - Options defining modal configuration.
     * @param templateToUpdate - The template to update.
     */
    constructor(app: App, modalOptions: I_ModalOptions, templateToUpdate: Template) {
        super(app);
        this.modalOptions = modalOptions;
        this.templateToUpdate = templateToUpdate;
    }

    /**
     * Called when the modal is opened.
     * Sets up the structure by creating a header, a title in it and a main section.
     * Delegates main content creation by calling the `BuildMain()` method.
     */
    onOpen() {
        const {contentEl} = this;
        contentEl.addClass("flashcards--width-100", "flashcards--flex-column", "flashcards--justify-center", "flashcards--align-center", "flashcards--gap-16");
        const header = CreateHeader(contentEl);
        CreateTitle(header, this.modalOptions.modalTitle);
        const main = CreateMain(contentEl);
        this.BuildMain(main, this.templateToUpdate);
    }

    /**
     * Called when the modal is closed.
     * Cleans up the modal to free memory.
     */
    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }

    /**
     * Builds the modal content :
     * - Adds an input fields for template name and description ;
     * - Adds a button allowing the user to create a new template field for the front part of the template ;
     * - Adds a button allowing the user to create a new template field for the back part of the template ;
     * - Adds a confirm button that triggers template creation ;
     * - Registers a keyboard shortcut (SHIFT + ENTER) that also triggers template creation.
     * @param parent - The parent HTML Element where the form is rendered.
     * @param templateToUpdate - The template to update.
     * @protected
     */
    protected BuildMain(parent: HTMLElement, templateToUpdate: Template): void {
        // General Information Section
        const generalInformationContainer: HTMLElement = CreateSection(parent);
        CreateSubtitle(generalInformationContainer, "General information");

        // Template Name Input (Auto-Filling)
        const nameInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Name", "A wonderful template", null));
        const nameInput: HTMLInputElement = nameInputGroupContainer.querySelector("input");
        nameInput.value = templateToUpdate.name;

        // Template Description Input (Auto-Filling)
        const descriptionInputGroupContainer: HTMLDivElement = CreateInputGroup(generalInformationContainer, new InputGroupData("text", "Description", "This template is templating !", null));
        const descriptionInput: HTMLInputElement = descriptionInputGroupContainer.querySelector("input");
        descriptionInput.value = templateToUpdate.description;

        // Template Main Field Selector (Auto-Filling
        const mainFieldSelector: DropdownComponent = CreateDropdown(generalInformationContainer, "Choose a main field among the front fields you created");
        for (let frontFieldsKey in this.templateToUpdate.frontFields) {
            mainFieldSelector.addOption(frontFieldsKey, frontFieldsKey);
            if (frontFieldsKey == this.templateToUpdate.mainField) {
                mainFieldSelector.setValue(frontFieldsKey);
            }
        }

        // Field Information Section
        const fieldInformationContainer: HTMLElement = CreateSection(parent);

        // Front Field Sub-Section (Auto-Filling)
        const frontFieldHeader: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-row", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-16"]);
        CreateSubtitle(frontFieldHeader, "Front fields", ["flashcards--width-fit-content"]);
        const addFrontFieldButton: ButtonComponent = CreateButton(frontFieldHeader, true, "", "plus", ["flashcards--width-fit-content"]);
        const frontFieldContainer: HTMLDivElement = CreateContainer(fieldInformationContainer, ["flashcards--flex-column", "flashcards--justify-between", "flashcards--align-center", "flashcards--gap-8"]);
        for (let fieldsKey in templateToUpdate.frontFields) {
            const fieldInputGroupContainer: HTMLDivElement = GenerateTemplateFieldInputGroupContainer(frontFieldContainer);
            const fieldInput: HTMLInputElement = fieldInputGroupContainer.querySelector("input");
            fieldInput.value = fieldsKey;
            fieldInput.addEventListener("input", () => {
                const inputs: NodeListOf<HTMLInputElement> = frontFieldContainer.querySelectorAll("input");
                mainFieldSelector.selectEl.empty();
                mainFieldSelector.addOption("default", "Choose a main field among the front fields you created");
                inputs.forEach((input: HTMLInputElement) => {
                    mainFieldSelector.addOption(input.value, input.value);
                    if (input.value == this.templateToUpdate.mainField) {
                        mainFieldSelector.setValue(input.value);
                    } else {
                        mainFieldSelector.setValue(fieldInput.value);
                    }
                })
            });
            const fieldSelector: HTMLSelectElement = fieldInputGroupContainer.querySelector("select");
            fieldSelector.value = templateToUpdate.frontFields[fieldsKey];
        }
        addFrontFieldButton.onClick(async () => {
            let frontFieldInput: HTMLInputElement = GenerateTemplateFieldInputGroupContainer(frontFieldContainer).querySelector("input");
            frontFieldInput.addEventListener("input", () => {
                const inputs: NodeListOf<HTMLInputElement> = frontFieldContainer.querySelectorAll("input");
                mainFieldSelector.selectEl.empty();
                mainFieldSelector.addOption("default", "Choose a main field among the front fields you created");
                inputs.forEach((input: HTMLInputElement) => {
                    mainFieldSelector.addOption(input.value, input.value);
                })
            });
        });

        // Back Field Sub-Section (Auto-Filling)
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

        // Submit Section
        const submitContainer: HTMLElement = CreateSection(parent);

        // Confirm Button
        const confirmButton: ButtonComponent = CreateButton(submitContainer, true, this.modalOptions.modalConfirmButtonText, this.modalOptions.modalConfirmButtonIcon);
        confirmButton.onClick(async () => {
            this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput, mainFieldSelector);
        });

        // Keyboard Shortcut : SHIFT + ENTER
        this.contentEl.addEventListener("keydown", async (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                this.ProcessData(database, frontFieldContainer, backFieldContainer, nameInput, descriptionInput, mainFieldSelector);
            }
        });
    }

    /**
     * Updates the new template in the database using a partial and the provided form inputs.
     * Closes the modal once the template is updated.
     * @param database - The LokiJS database instance.
     * @param frontFieldContainer - Front field container.
     * @param backFieldContainer - Back Field Container.
     * @param nameInput - Deck name input element.
     * @param descriptionInput - Deck description input element.
     * @protected
     */
    protected ProcessData(database: Loki, frontFieldContainer?: HTMLDivElement, backFieldContainer?: HTMLDivElement, nameInput?: HTMLInputElement, descriptionInput?: HTMLInputElement, mainFieldSelector?: DropdownComponent) {
        let frontFields: Record<string, string> = BuildFieldRecord(frontFieldContainer);
        let backFields: Record<string, string> = BuildFieldRecord(backFieldContainer);
        let partialTemplate: Partial<Template> = {};
        partialTemplate.name = nameInput.value;
        partialTemplate.description = descriptionInput.value;
        partialTemplate.mainField = mainFieldSelector.getValue();
        partialTemplate.frontFields = frontFields;
        partialTemplate.backFields = backFields;
        Template.Update(database, this.templateToUpdate.id, partialTemplate);
        this.close();
    }
}