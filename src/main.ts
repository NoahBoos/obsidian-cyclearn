import {Plugin, WorkspaceLeaf} from "obsidian";
import {DEFAULT_SETTINGS, I_FlashcardsSettings} from "./settings/I_FlashcardsSettings";
import {InitializeDatabase} from "./database/Database";
import {V_FlashcardsView, VT_FLASHCARDS_VIEW_TYPE} from "./views/V_FlashcardsView";
import {FlashcardsSettingTab} from "./settings/FlashcardsSettingTab";

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