import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Tag {
    public id: string;
    public name: string;
    public description: string;

    constructor(name: string, description: string, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static Create(database: Loki, name: string, description: string): Tag {
        const newTag = new Tag(name, description);
        database.getCollection<Tag>("tags").insert(newTag);
        return newTag;
    }

    public static ReadOne(database: Loki, idToRead: string): Tag {
        return database.getCollection<Tag>("tags").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Tag[] {
        return database.getCollection<Tag>("tags").find();
    }

    public static Update(database: Loki, idToUpdate: string, newTagData: Partial<Tag>): boolean {
        const tagToUpdate: Tag = database.getCollection<Tag>("tags").findOne({ id: idToUpdate });
        if (!tagToUpdate) return false;
        Object.assign(tagToUpdate, newTagData);
        database.getCollection<Tag>("tags").update(tagToUpdate);
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const tagToDelete = database.getCollection<Tag>("tags").findOne({ id: idToDelete });
        if (!tagToDelete) return false;
        database.getCollection<Tag>("tags").remove(tagToDelete);
        return true;
    }
}