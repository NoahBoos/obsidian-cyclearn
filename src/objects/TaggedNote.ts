import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class TaggedNote {
    public id: string;
    public id_note: string;
    public id_tag: string;

    constructor(idNote: string, idTag: string, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_note = idNote;
        this.id_tag = idTag;
    }

    public static Create(database: Loki, idNote: string, idTag: string): TaggedNote {
        const newTaggedNote = new TaggedNote(idNote, idTag);
        database.getCollection<TaggedNote>("notes_tags").insert(newTaggedNote);
        return newTaggedNote;
    }

    public static ReadOne(database: Loki, idToRead: string): TaggedNote {
        return database.getCollection<TaggedNote>("notes_tags").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): TaggedNote[] {
        return database.getCollection<TaggedNote>("notes_tags").find();
    }

    public static ReadAllByNote(database: Loki, idNote: string): TaggedNote[] {
        return database.getCollection<TaggedNote>("notes_tags").find({ id_note: idNote });
    }

    public static ReadAllByTag(database: Loki, idTag: string): TaggedNote[] {
        return database.getCollection<TaggedNote>("notes_tags").find({ id_tag: idTag });
    }

    public static Update(database: Loki, idToUpdate: string, newTaggedNoteData: Partial<TaggedNote>): boolean {
        const taggedNoteToUpdate: TaggedNote = database.getCollection<TaggedNote>("notes_tags").findOne({ id: idToUpdate });
        if (!taggedNoteToUpdate) return false;
        Object.assign(taggedNoteToUpdate, newTaggedNoteData);
        database.getCollection<TaggedNote>("notes_tags").update(taggedNoteToUpdate);
        return true;
    }
}