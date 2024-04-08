import { Card, Player, Suit } from "../types";

const suits: Suit[] = ["C", "S", "D", "H"];
const cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export const IMAGES: Record<string, string> = {
  C: "/clubs.png",
  H: "/hearts.png",
  S: "/spades.png",
  D: "/diamonds.png",
};

export const makeCards = (decks: number): Card[] => {
  const arr: Card[] = [];
  for (let i = 0; i < decks; ++i) {
    for (const suit of suits) {
      for (const card of cards) {
        arr.push({ suit, card } as Card);
      }
    }
  }
  return arr;
};

export const shuffle = (arr: any[]) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const groupCardsByType = (deck: Card[]) => {
  return deck.reduce((groups, card) => {
    if (groups[card.card]) {
      groups[card.card].push(card);
    } else {
      groups[card.card] = [card];
    }
    return groups;
  }, {} as Record<string, Card[]>);
};

export const pickRandomCards = (deck: Card[], num = 4) => {
  const pick = Math.ceil(Math.random() * num);
  return deck.slice(0, pick);
};

export const createPlayers = (decks: number): Player[] => {
  const deck: Card[] = shuffle(makeCards(decks));
  const players: Player[] = new Array(4)
    .fill(0)
    .map(() => ({ cards: [], state: "PLAY", lie: (0.1 + Math.random()) / 2 }));
  const end = Math.floor(deck.length / players.length);
  let i = 0;
  for (let j = 0; j < deck.length; j += end) {
    players[i].cards = deck.slice(j, j + end);
    i++;
  }
  return players;
};

export const findStart = (players: Player[]) => {
  for (let i = 0; i < players.length; ++i) {
    const hasAceOfSpades = players[i].cards.find(
      (c) => c.suit === "S" && c.card === "A"
    );
    if (hasAceOfSpades) {
      return i;
    }
  }
  return -1;
};

export const chooseFirstHand = (deck: Card[], lie = 0.5) => {
  const shouldLie = Math.random() <= lie;
  if (shouldLie) {
    const cards = pickRandomCards(deck, 4);
    const card = cards[Math.floor(Math.random() * cards.length)];

    return { type: card.card, cards };
  }
  const groups = groupCardsByType(deck);
  const keys = Object.keys(groups);
  const sorted = keys.sort((a, b) => groups[b].length - groups[a].length);
  const randomKey =
    Math.random() > 0.67
      ? keys[Math.floor(Math.random() * keys.length)]
      : sorted[0];
  return { type: randomKey, cards: groups[randomKey] };
};

export const chooseCards = (deck: Card[], type: string | null, lie = 0.5) => {
  const shouldLie = Math.random() <= lie;
  if (shouldLie) {
    const cards = pickRandomCards(deck, 4);
    return { type, cards };
  }
  const groups = groupCardsByType(deck);
  let cards: Card[] = [];
  if (type && groups[type]) {
    const size = Math.floor(Math.random() * groups[type].length);
    cards = groups[type].slice(0, size);
  }
  return { type, cards };
};
