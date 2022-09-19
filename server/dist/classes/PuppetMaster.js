"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../functions/card");
const string_1 = require("../utils/string");
const cards_1 = require("./cards");
const Card_1 = require("./cards/Card");
const constants_1 = require("./constants");
const Game_1 = require("./Game");
class PuppetMaster {
    constructor(userId) {
        this.id = userId;
        this.narrative = 0;
        this.funding = constants_1.MAX_FUNDING;
        this.lookHand = [];
        this.stowedHand = [];
        this.deck = [];
        this.discardPile = [];
        this.theThinkTank = undefined;
        this.activeZone = [];
        this.location = undefined;
    }
    getCardCount(key = "id") {
        const cardCounts = this.deck.reduce((counts, card) => {
            const cardKey = card[key];
            counts[cardKey] = ++counts[cardKey] || 1;
            return counts;
        }, {});
        return cardCounts;
    }
    setDeck(cardIds) {
        cardIds.forEach((cardId) => {
            this.addCard(cardId);
        });
    }
    shuffleDeck() {
        this.deck.sort(() => {
            return 0.5 - Math.random();
        });
    }
    drawCards(amount) {
        const draw = Math.min(this.deck.length, amount);
        const cards = this.deck.splice(0, draw);
        if (this.deck.length === 0) {
            this.deck.push(...this.discardPile);
            this.shuffleDeck();
            this.discardPile = [];
        }
        const remaining = amount - cards.length;
        if (remaining > 0) {
            cards.push(...this.deck.splice(0, remaining));
        }
        this.lookHand.push(...cards);
    }
    tapCard(cardUuid) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return false;
        }
        const { card, location } = cardAndLocation;
        const cardIsOnBoard = location === Game_1.GAME_ZONE.ACTIVE_ZONE ||
            location === Game_1.GAME_ZONE.THE_THINK_TANK;
        if (!cardIsOnBoard) {
            return false;
        }
        card.tapped = !card.tapped;
        return true;
    }
    moveCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return false;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return false;
        }
        const newZone = (0, string_1.hyphenToCamelCase)(destination);
        if (Array.isArray(this[newZone])) {
            this[newZone].push(card);
        }
        else {
            this[newZone] = card;
        }
        const oldZone = (0, string_1.hyphenToCamelCase)(location);
        if (Array.isArray(this[oldZone])) {
            const cardIndex = this[oldZone].findIndex((card) => card.uuid === cardUuid);
            this[oldZone].splice(cardIndex, 1);
        }
        else {
            this[oldZone] = undefined;
        }
        return true;
    }
    discardHand() {
        this.discardPile.push(...this.lookHand);
        this.lookHand = [];
    }
    playCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return false;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return false;
        }
        const cost = destination === Game_1.GAME_ZONE.STOWED_HAND
            ? constants_1.STOW_CARD_FUNDING_COST
            : card.cost;
        const cantAfford = this.funding - cost < 0;
        if (cantAfford) {
            return false;
        }
        if (destination === Game_1.GAME_ZONE.LOCATION &&
            card.type !== Card_1.CARD_TYPE.LOCATION) {
            return false;
        }
        this.funding = this.funding - cost;
        const cardMoved = this.moveCard(cardUuid, destination);
        return cardMoved;
    }
    findCardByUuid(cardUuid) {
        var _a, _b;
        const cardInLookHand = this.lookHand.find(({ uuid }) => uuid === cardUuid);
        if (cardInLookHand) {
            return {
                card: cardInLookHand,
                location: Game_1.GAME_ZONE.LOOK_HAND,
            };
        }
        const cardInStowedHand = this.stowedHand.find(({ uuid }) => uuid === cardUuid);
        if (cardInStowedHand) {
            return {
                card: cardInStowedHand,
                location: Game_1.GAME_ZONE.STOWED_HAND,
            };
        }
        const cardInDiscardPile = this.discardPile.find(({ uuid }) => uuid === cardUuid);
        if (cardInDiscardPile) {
            return {
                card: cardInDiscardPile,
                location: Game_1.GAME_ZONE.DISCARD_PILE,
            };
        }
        const cardInDeck = this.deck.find(({ uuid }) => uuid === cardUuid);
        if (cardInDeck) {
            return {
                card: cardInDeck,
                location: Game_1.GAME_ZONE.DECK,
            };
        }
        const cardInActiveZone = this.activeZone.find(({ uuid }) => uuid === cardUuid);
        if (cardInActiveZone) {
            return {
                card: cardInActiveZone,
                location: Game_1.GAME_ZONE.ACTIVE_ZONE,
            };
        }
        const cardInTheThinkTank = ((_a = this.theThinkTank) === null || _a === void 0 ? void 0 : _a.uuid) === cardUuid ? this.theThinkTank : null;
        if (cardInTheThinkTank) {
            return {
                card: cardInTheThinkTank,
                location: Game_1.GAME_ZONE.THE_THINK_TANK,
            };
        }
        const cardInLocation = ((_b = this.location) === null || _b === void 0 ? void 0 : _b.uuid) === cardUuid ? this.location : null;
        if (cardInLocation) {
            return {
                card: cardInLocation,
                location: Game_1.GAME_ZONE.LOCATION,
            };
        }
        return null;
    }
    addCard(cardId) {
        const cardCounts = this.getCardCount();
        if (cardCounts[cardId] > constants_1.MAX_COPIES_OF_CARD_PER_DECK) {
            return false;
        }
        const card = (0, card_1.getCardById)(cardId);
        if (!card) {
            return false;
        }
        switch (card.type) {
            case Card_1.CARD_TYPE.CREATURE: {
                this.deck.push(new cards_1.Creature(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype, card.stats));
                break;
            }
            case Card_1.CARD_TYPE.CHALLENGE: {
                this.deck.push(new cards_1.Challenge(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.BUFF: {
                this.deck.push(new cards_1.Buff(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.GROUP: {
                this.deck.push(new cards_1.Group(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.INFORMATION: {
                this.deck.push(new cards_1.Information(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.ITEM: {
                this.deck.push(new cards_1.Item(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.LOCATION: {
                this.deck.push(new cards_1.Location(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.PLOT_TWIST: {
                this.deck.push(new cards_1.PlotTwist(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.SKILL: {
                this.deck.push(new cards_1.Skill(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            case Card_1.CARD_TYPE.TACTIC: {
                this.deck.push(new cards_1.Tactic(card.id, card.name, this.id, card.bodyText, card.faction, card.rarity, card.subtype));
                break;
            }
            default: {
                break;
            }
        }
        return true;
    }
}
exports.default = PuppetMaster;
//# sourceMappingURL=PuppetMaster.js.map