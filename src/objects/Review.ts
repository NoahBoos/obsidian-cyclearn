import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Review {
    public id: string;
    public id_card: string;
    public reviewed_at: string;
    public grade: number;
    public time_taken: number;

    constructor(idCard: string, reviewedAt: string, grade: number, timeTaken: number = 0, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_card = idCard;
        this.reviewed_at = reviewedAt;
        this.grade = grade;
        this.time_taken = timeTaken;
    }

    public static Create(database: Loki, idCard: string, reviewAt: string, grade: number, timeTaken: number) {
        const newReview = new Review(idCard, reviewAt, grade, timeTaken);
        database.getCollection<Review>("reviews").insert(newReview);
        database.saveDatabase();
        return newReview;
    }

    public static ReadOne(database: Loki, idToRead: string): Review {
        return database.getCollection<Review>("reviews").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Review[] {
        return database.getCollection<Review>("reviews").find();
    }

    public static ReadAllByCard(database: Loki, idCard: string): Review[] {
        return database.getCollection<Review>("reviews").find({ id_card: idCard });
    }

    public static Update(database: Loki, idToUpdate: string, newReviewData: Partial<Review>): boolean {
        const reviewToUpdate: Review = database.getCollection<Review>("reviews").findOne({ id: idToUpdate });
        if (!reviewToUpdate) return false;
        Object.assign(reviewToUpdate, newReviewData);
        database.getCollection<Review>("reviews").update(reviewToUpdate);
        database.saveDatabase();
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const reviewToDelete = database.getCollection<Review>("reviews").findOne({ id: idToDelete });
        if (!reviewToDelete) return false;
        database.getCollection<Review>("reviews").remove(reviewToDelete);
        database.saveDatabase();
        return true;
    }
}