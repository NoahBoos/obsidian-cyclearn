import * as fs from "fs";
import Loki from "lokijs";
import Cyclearn from "../main";

export let database: Loki;

export function InitializeDatabase(cyclearn: Cyclearn) {
    const PATH_DATABASE = `${this.app.vault.adapter.basePath}/${this.app.vault.configDir}/plugins/obsidian-${cyclearn.manifest.id}/database.json`;

    if (!fs.existsSync(PATH_DATABASE)) {
        fs.writeFileSync(PATH_DATABASE, JSON.stringify({}));
    }

    database = new Loki(PATH_DATABASE, {
        autosave: true,
        autosaveInterval: 5000,
        persistenceMethod: 'fs'
    });

    database.loadDatabase({}, () => {
        if (!database.getCollection("decks")) database.addCollection("decks");
        if (!database.getCollection("templates")) database.addCollection("templates");
        if (!database.getCollection("tags")) database.addCollection("tags");
        if (!database.getCollection("notes")) database.addCollection("notes");
        if (!database.getCollection("cards")) database.addCollection("cards");
        if (!database.getCollection("reviews")) database.addCollection("reviews");
        if (!database.getCollection("notes_tags")) database.addCollection("notes_tags");
    })
}