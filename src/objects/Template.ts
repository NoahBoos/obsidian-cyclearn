import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Template {
    public id: string;
    public name: string;
    public description: string;
    public fields: Record<string, string>;

    constructor(name: string, description: string, fields: Record<string, string>, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.fields = fields;
    }

    public static Create(database: Loki, name: string, description: string, fields: Record<string, string>): Template {
        const newTemplate = new Template(name, description, fields);
        database.getCollection<Template>("templates").insert(newTemplate);
        return newTemplate;
    }

    public static ReadOne(database: Loki, idToRead: string): Template {
        return database.getCollection<Template>("templates").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Template[] {
        return database.getCollection<Template>("templates").find();
    }

    public static Update(database: Loki, idToUpdate: string, newTemplateData: Partial<Template>): boolean {
        const templateToUpdate: Template = database.getCollection<Template>("templates").findOne({ id: idToUpdate });
        if (!templateToUpdate) return false;
        Object.assign(templateToUpdate, newTemplateData);
        database.getCollection<Template>("templates").update(templateToUpdate);
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const templateToDelete = database.getCollection<Template>("templates").findOne({ id: idToDelete });
        if (!templateToDelete) return false;
        database.getCollection<Template>("decks").remove(templateToDelete);
        return true;
    }
}