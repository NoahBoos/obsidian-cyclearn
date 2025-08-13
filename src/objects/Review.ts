import {GENERATE_UUID} from "../utils/U_GenerateUUID";

export class Review {
    public id: string;
    public id_card: string;
    public reviewed_at: string;
    public grade: number;
    public time_taken: number;

    constructor(id_card: string, reviewed_at: string, grade: number, time_taken: number = 0, id: string = GENERATE_UUID(16)) {
        this.id = id;
        this.id_card = id_card;
        this.reviewed_at = reviewed_at;
        this.grade = grade;
        this.time_taken = time_taken;
    }

    public static Create(database: Loki, id_card: string, review_at: string, grade: number, time_taken: number) {
        const newReview = new Review(id_card, review_at, grade, time_taken);
        database.getCollection<Review>("reviews").insert(newReview);
        return newReview;
    }

    public static ReadOne(database: Loki, idToRead: string): Review {
        return database.getCollection<Review>("reviews").findOne({ id: idToRead });
    }

    public static ReadAll(database: Loki): Review[] {
        return database.getCollection<Review>("reviews").find();
    }

    public static Update(database: Loki, idToUpdate: string, newReviewData: Partial<Review>): boolean {
        const reviewToUpdate: Review = database.getCollection<Review>("reviews").findOne({ id: idToUpdate });
        if (!reviewToUpdate) return false;
        Object.assign(reviewToUpdate, newReviewData);
        database.getCollection<Review>("reviews").update(reviewToUpdate);
        return true;
    }

    public static Delete(database: Loki, idToDelete: string): boolean {
        const reviewToDelete = database.getCollection<Review>("reviews").findOne({ id: idToDelete });
        if (!reviewToDelete) return false;
        database.getCollection<Review>("reviews").remove(reviewToDelete);
        return true;
    }
}