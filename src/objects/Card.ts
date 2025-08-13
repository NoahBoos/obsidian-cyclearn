import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Card {
    public id: string;
    public id_note: string;
    public due_at: number;
    public ease_factor: number;
    public interval: number;
    public review_amount: number;

    constructor(idNote: string, dueAt: number, easeFactor: number = 2.5, interval: number = 1, reviewAmount: number = 0, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_note = idNote;
        this.due_at = dueAt;
        this.ease_factor = easeFactor;
        this.interval = interval;
        this.review_amount = reviewAmount;
    }

    public static Create(database: Loki, idNote: string, dueAt: number): Card {
        const newCard = new Card(idNote, dueAt);
        database.getCollection<Card>("cards").insert(newCard);
        return newCard;
    }

    public static ReadOne(database: Loki, idToRead: string): Card {
        return database.getCollection<Card>("cards").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Card[] {
        return database.getCollection<Card>("cards").find();
    }

    public static ReadAllByNote(database: Loki, idNote: string): Card[] {
        return database.getCollection<Card>("cards").find({ id_note: idNote });
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