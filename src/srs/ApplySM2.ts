import {Card} from "../objects/Card";
import {database} from "../database/Database";
import {GetToday} from "../utils/U_GenerateDate";

export function ApplySM2(card: Card, grade: number) {
    let partialCard: Partial<Card> = {};
    if (grade < 3) {
        partialCard.review_amount = 0;
        partialCard.interval = 1;
        partialCard.ease_factor = Math.max(1.3, card.ease_factor - 0.2);
    } else {
        partialCard.review_amount = card.review_amount + 1;
        if (partialCard.review_amount == 1) {
            partialCard.interval = 1;
        } else if (partialCard.review_amount == 2) {
            partialCard.interval = 6;
        } else {
            partialCard.interval = Math.round(card.interval * card.ease_factor);
        }
        partialCard.ease_factor = card.ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        partialCard.ease_factor = Math.max(1.3, partialCard.ease_factor);
    }
    partialCard.due_at = parseInt(GetToday()) + partialCard.interval;

    Card.Update(database, card.id, partialCard);
}