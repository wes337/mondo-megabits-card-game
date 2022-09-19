import { CardType } from "../classes/cards/Card";
import { allCards } from "../data";

export const allBasicCards = allCards.filter(
  (card) => !card.fileStem.includes("a")
);

export const getRandomCards = (amount: number) => {
  const shuffledCards = [...allBasicCards].sort(() => {
    return 0.5 - Math.random();
  });

  return shuffledCards.slice(0, amount);
};

export const getRandomCardIds = (amount: number) => {
  const randomCards = getRandomCards(amount);
  return randomCards.map((card) => card.id.toString());
};

export const getRandomCardsByType = (amount: number, type: CardType) => {
  const cards = allBasicCards.filter((card) => card.type === type);

  const shuffledCards = [...cards].sort(() => {
    return 0.5 - Math.random();
  });

  return shuffledCards.slice(0, amount);
};
