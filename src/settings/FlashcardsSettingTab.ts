import {App, PluginSettingTab} from "obsidian";
import Flashcards from "../main";

export class FlashcardsSettingTab extends PluginSettingTab {
    plugin: Flashcards;

    constructor(app: App, plugin: Flashcards) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
    }
}