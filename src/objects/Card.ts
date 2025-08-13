import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Card {
    public id: string;
    public id_note: string;
    public due_at: number;
    public ease_factor: number;
    public interval: number;
    public review_amount: number;

    constructor(id_note: string, due_at: number, ease_factor: number = 2.5, interval: number = 1, review_amount: number = 0, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_note = id_note;
        this.due_at = due_at;
        this.ease_factor = ease_factor;
        this.interval = interval;
        this.review_amount = review_amount;
    }

    public static Create(database: Loki, id_note: string, due_at: number): Card {
        const newCard = new Card(id_note, due_at);
        database.getCollection<Card>("cards").insert(newCard);
        return newCard;
    }

    public static ReadOne(database: Loki, idToRead: string): Card {
        return database.getCollection<Card>("cards").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Card[] {
        return database.getCollection<Card>("cards").find();
    }

    public static Update(database: Loki, idToUpdate: string, newCardData: Partial<Card>): boolean {
        const cardToUpdate: Card = database.getCollection<Card>("cards").findOne({ id: idToUpdate });
        if (!cardToUpdate) return false;
        Object.assign(cardToUpdate, newCardData);
        database.getCollection<Card>("cards").update(cardToUpdate);
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const cardToDelete = database.getCollection<Card>("cards").findOne({ id: idToDelete });
        if (!cardToDelete) return false;
        database.getCollection<Card>("cards").remove(cardToDelete);
        return true;
    }
}