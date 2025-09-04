import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Note {
    public id: string;
    public id_deck: string;
    public id_template: string;
    public frontFields: Record<string, string>;
    public backFields: Record<string, string>;
    public hasTwoFaces: boolean;

    constructor(idDeck: string, idTemplate: string, frontFields: Record<string, string> = {}, backFields: Record<string, string> = {},hasTwoFaces: boolean = true, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_deck = idDeck;
        this.id_template = idTemplate;
        this.frontFields = frontFields;
        this.backFields = backFields;
        this.hasTwoFaces = hasTwoFaces;
    }

    public static Create(database: Loki, idDeck: string, idTemplate: string, frontFields: Record<string, string>, backFields: Record<string, string>, hasTwoFaces: boolean): Note {
        const newNote = new Note(idDeck, idTemplate, frontFields, backFields, hasTwoFaces);
        database.getCollection<Note>("notes").insert(newNote);
        database.saveDatabase();
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
        database.saveDatabase();
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const noteToDelete = database.getCollection<Note>("notes").findOne({ id: idToDelete });
        if (!noteToDelete) return false;
        database.getCollection<Note>("notes").remove(noteToDelete);
        database.saveDatabase();
        return true;
    }
}