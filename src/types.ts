

export type Suit = "C" | "S" | "D" | "H";

export type Card = {
  suit: Suit;
  card: string;
};

export type Hand = {
  type: string | null;
  cards: Card[];
  lastTurn: number;
};

export type Player = {
  cards: Card[];
  state: string;
  lie: number;
};
