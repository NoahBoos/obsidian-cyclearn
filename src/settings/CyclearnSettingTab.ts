import {App, PluginSettingTab} from "obsidian";
import Cyclearn from "../main";

export class CyclearnSettingTab extends PluginSettingTab {
    plugin: Cyclearn;

    constructor(app: App, plugin: Cyclearn) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
    }
}