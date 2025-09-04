import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Deck {
    public id: string;
    public name: string;
    public description: string;

    constructor(name: string, description: string, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static Create(database: Loki, name: string, description: string): Deck {
        const newDeck = new Deck(name, description);
        database.getCollection<Deck>("decks").insert(newDeck);
        database.saveDatabase();
        return newDeck;
    }

    public static ReadOne(database: Loki, idToRead: string): Deck {
        return database.getCollection<Deck>("decks").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Deck[] {
        return database.getCollection<Deck>("decks").find();
    }

    public static Update(database: Loki, idToUpdate: string, newDeckData: Partial<Deck>): boolean {
        const deckToUpdate: Deck = database.getCollection<Deck>("decks").findOne({ id: idToUpdate });
        if (!deckToUpdate) return false;
        Object.assign(deckToUpdate, newDeckData);
        database.getCollection<Deck>("decks").update(deckToUpdate);
        database.saveDatabase();
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const deckToDelete = database.getCollection<Deck>("decks").findOne({ id: idToDelete });
        if (!deckToDelete) return false;
        database.getCollection<Deck>("decks").remove(deckToDelete);
        database.saveDatabase();
        return true;
    }
}