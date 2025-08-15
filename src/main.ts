import {Plugin, WorkspaceLeaf} from "obsidian";
import {DEFAULT_SETTINGS, I_FlashcardsSettings} from "./settings/I_FlashcardsSettings";
import {InitializeDatabase} from "./database/Database";
import {V_FlashcardsView, VT_FLASHCARDS_VIEW_TYPE} from "./views/V_FlashcardsView";
import {ActivateView} from "./utils/U_View";
import {FlashcardsSettingTab} from "./settings/FlashcardsSettingTab";
import {CreateDeckModal} from "./modals/CreateDeckModal";
import {
    CREATE_DECK_MODAL_OPTIONS,
    CREATE_TAG_MODAL_OPTIONS,
    CREATE_TEMPLATE_MODAL_OPTIONS
} from "./modals/I_ModalOptions";
import {CreateTagModal} from "./modals/CreateTagModal";
import {CreateTemplateModal} from "./modals/CreateTemplateModal";

export default class Flashcards extends Plugin {
    settings: I_FlashcardsSettings;

    async onload() {
        await this.LoadSettings();
        InitializeDatabase(this);
        this.registerView(VT_FLASHCARDS_VIEW_TYPE, (leaf: WorkspaceLeaf) => new V_FlashcardsView(leaf, this));

        this.addCommand({
            id: "flashcards-home",
            name: "Home",
            callback: () => {
                ActivateView(VT_FLASHCARDS_VIEW_TYPE);
            }
        });

        this.addCommand({
            id: "flashcards-create-deck",
            name: "Create a new deck",
            callback: () => {
                new CreateDeckModal(this.app, CREATE_DECK_MODAL_OPTIONS).open();
            }
        });

        this.addCommand({
           id: "flashcards-create-tag",
           name: "Create a new tag",
           callback: () => {
               new CreateTagModal(this.app, CREATE_TAG_MODAL_OPTIONS).open();
           }
        });

        this.addCommand({
            id: "flashcards-create-template",
            name: "Create a new template",
            callback: () => {
                new CreateTemplateModal(this.app, CREATE_TEMPLATE_MODAL_OPTIONS).open();
            }
        })
    }

    async onunload() {
        await this.SaveSettings();
    }

    async LoadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async SaveSettings() {
        await this.saveData(this.settings);
    }
}