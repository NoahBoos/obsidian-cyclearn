import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Note {
    public id: string;
    public id_deck: string;
    public id_template: string;
    public fields: Record<string, string>;

    constructor(id_deck: string, id_template: string, fields: Record<string, string> = {}, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_deck = id_deck;
        this.id_template = id_template;
        this.fields = fields;
    }

    public static Create(database: Loki, id_deck: string, id_template: string, fields: Record<string, string>): Note {
        const newNote = new Note(id_deck, id_template, fields);
        database.getCollection<Note>("notes").insert(newNote);
        return newNote;
    }

    public static ReadOne(database: Loki, idToRead: string): Note {
        return database.getCollection<Note>("notes").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Note[] {
        return database.getCollection<Note>("notes").find();
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