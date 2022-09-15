import { allCards } from "../data";

export const getCardImage = (card) => {
  return `https://mondomegabits.com/card/img/95/${card.fileStem}.jpg`;
};

export const getCardImageById = (cardId) => {
  const card = allCards.find(
    (card) => card.id.toString() === cardId.toString()
  );
  return getCardImage(card);
};
