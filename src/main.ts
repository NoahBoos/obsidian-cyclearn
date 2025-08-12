import {Plugin} from "obsidian";
import {DEFAULT_SETTINGS, I_FlashcardsSettings} from "./interfaces/I_FlashcardsSettings";

export default class Flashcards extends Plugin {
    settings: I_FlashcardsSettings;

    async onload() {
        await this.LoadSettings();
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