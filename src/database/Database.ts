import * as fs from "fs";
import Loki from "lokijs";
import Flashcards from "../main";

export function InitializeDatabase(flashcards: Flashcards) {
    const PATH_DATABASE = `${this.app.vault.adapter.basePath}/.obsidian/plugins/obsidian-${flashcards.manifest.id}/database.json`;

    if (!fs.existsSync(PATH_DATABASE)) {
        fs.writeFileSync(PATH_DATABASE, JSON.stringify({}));
    }

    const database = new Loki(PATH_DATABASE, {
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