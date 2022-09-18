import { allCards } from "../data";

export const getCardImage = (card) => {
  return `https://mondomegabits.com/card/img/95/${card.fileStem}.jpg`;
};

export const getCardById = (cardId: string | number) => {
  const card = allCards.find(
    (card) => card.id.toString() === cardId.toString()
  );
  return card;
};

export const getCardImageById = (cardId: string | number) => {
  const card = getCardById(cardId);
  return getCardImage(card);
};
