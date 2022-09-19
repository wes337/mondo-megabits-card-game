import { getRandomCardsByType } from "../utils/card";
import Deck from "./Deck";

describe("Deck", () => {
  it("should give count of card types", () => {
    const deck = new Deck("Test");

    const threeRandomCreatures = getRandomCardsByType(3, "Creature");
    const threeRandomItems = getRandomCardsByType(3, "Item");

    [...threeRandomCreatures, ...threeRandomItems].forEach((card) => {
      deck.addCard(card.id);
    });

    expect(deck.getCardCount("type")).toMatchObject({
      Creature: 3,
      Item: 3,
    });
  });

  it("should invalidate deck if there is too many of one card", () => {
    const deck = new Deck("Test");
    const cardId = "1";

    for (let i = 0; i < 3; i++) {
      deck.addCard(cardId);
    }

    expect(deck.valid).toBe(false);
  });
});
