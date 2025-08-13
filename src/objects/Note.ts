import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Note {
    public id: string;
    public id_deck: string;
    public id_template: string;
    public fields: Record<string, string>;

    constructor(idDeck: string, idTemplate: string, fields: Record<string, string> = {}, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_deck = idDeck;
        this.id_template = idTemplate;
        this.fields = fields;
    }

    public static Create(database: Loki, idDeck: string, idTemplate: string, fields: Record<string, string>): Note {
        const newNote = new Note(idDeck, idTemplate, fields);
        database.getCollection<Note>("notes").insert(newNote);
        return newNote;
    }

    public static ReadOne(database: Loki, idToRead: string): Note {
        return database.getCollection<Note>("notes").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Note[] {
        return database.getCollection<Note>("notes").find();
    }

    public static ReadAllByDeck(database: Loki, idDeck: string): Note[] {
        return database.getCollection<Note>("notes").find({ id_deck: idDeck });
    }

    public static ReadAllByTemplate(database: Loki, idTemplate: string): Note[] {
        return database.getCollection<Note>("notes").find({ id_template: idTemplate });
    }

    public static Update(database: Loki, idToUpdate: string, newNoteData: Partial<Note>): boolean {
        const noteToUpdate: Note = database.getCollection<Note>("notes").findOne({ id: idToUpdate });
        if (!noteToUpdate) return false;
        Object.assign(noteToUpdate, newNoteData);
        database.getCollection<Note>("notes").update(noteToUpdate);
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const noteToDelete = database.getCollection<Note>("notes").findOne({ id: idToDelete });
        if (!noteToDelete) return false;
        database.getCollection<Note>("notes").remove(noteToDelete);
        return true;
    }
}