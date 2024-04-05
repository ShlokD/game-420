import { useEffect, useState } from "preact/hooks";
import { Card, Hand, Player } from "../types";
import {
  IMAGES,
  chooseCards,
  chooseFirstHand,
  createPlayers,
  findStart,
} from "./game-utils";

const START_HAND = {
  type: null,
  cards: [],
  lastTurn: -1,
};

export type GameProps = {
  decks: number;
  handleEnd: () => void;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const Game = ({ decks, handleEnd }: GameProps) => {
  const [players, setPlayers] = useState<Player[]>(createPlayers(decks));
  const [turn, setTurn] = useState(findStart(players));
  const [stack, setStack] = useState<Card[]>([]);
  const [hand, setHand] = useState<Hand>(START_HAND);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [winner, setWinner] = useState(-1);
  const [revealHand, setRevealHand] = useState(false);

  const player = players[0];
  const disablePlay = turn === 0 && selectedCards.length === 0;

  const nextTurn = () => setTurn((prev) => (prev + 1) % 4);

  const startNewHand = () => {
    setPlayers((prev) => {
      return prev.map((p) => ({ ...p, state: "PLAY" }));
    });
    setStack([]);
    setTurn(hand.lastTurn);
    setHand((prev) => ({ ...prev, type: null, cards: [] }));
  };

  const passCurrentTurn = () => {
    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[turn].state = "PASS";
      return newPlayers;
    });
  };

  const playCPU = () => {
    const playerCards = players[turn].cards;
    const toPlayHand =
      hand.cards.length === 0
        ? chooseFirstHand(playerCards, players[turn].lie)
        : chooseCards(playerCards, hand.type, players[turn].lie);
    if (toPlayHand.cards.length === 0) {
      passCurrentTurn();
    } else {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[turn] = {
          ...newPlayers[turn],
          cards: newPlayers[turn].cards.filter(
            (c) => !toPlayHand.cards.includes(c)
          ),
        };
        return newPlayers;
      });
      setStack((prev) => [...prev, ...hand.cards]);
      setHand({ ...toPlayHand, lastTurn: turn });
    }
  };

  const playTurn = () => {
    if (players[turn].state === "PASS") {
      nextTurn();
      return;
    }
    if (turn === 0) {
      const toPlayHand = {
        cards: selectedCards,
        type: hand.type === null ? selectedCards[0].card : hand.type,
      };
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[turn] = {
          ...newPlayers[turn],
          cards: newPlayers[turn].cards.filter(
            (c) => !toPlayHand.cards.includes(c)
          ),
        };
        return newPlayers;
      });
      setStack((prev) => [...prev, ...hand.cards]);
      setHand({ ...toPlayHand, lastTurn: turn });
      nextTurn();
    } else {
      const shouldReveal =
        hand.cards.length > 0 && hand.lastTurn !== turn && Math.random() >= 0.5;
      if (shouldReveal) {
        reveal();
      } else {
        playCPU();
        nextTurn();
      }
    }
  };

  const reveal = async () => {
    setRevealHand(true);
    await delay(2000);
    if (hand.cards.every((card) => card.card === hand.type)) {
      setPlayers((prev) => {
        const newPlayers = prev.map((p) => ({ ...p, state: "PLAY" }));
        newPlayers[turn].cards = [
          ...newPlayers[turn].cards,
          ...stack,
          ...hand.cards,
        ];
        return newPlayers;
      });
      setHand((prev) => {
        return {
          ...prev,
          cards: [],
          type: null,
        };
      });
      setStack([]);
      setTurn(hand.lastTurn);
      setSelectedCards([]);
    } else {
      setPlayers((prev) => {
        const newPlayers = prev.map((p) => ({ ...p, state: "PLAY" }));
        newPlayers[hand.lastTurn].cards = [
          ...newPlayers[hand.lastTurn].cards,
          ...stack,
          ...hand.cards,
        ];

        return newPlayers;
      });
      setHand((prev) => {
        return {
          ...prev,
          cards: [],
          type: null,
        };
      });
      setStack([]);
      setSelectedCards([]);
    }
    setRevealHand(false);
  };

  const pass = () => {
    passCurrentTurn();
    nextTurn();
  };

  const reset = () => {
    setSelectedCards([]);
  };

  const addToSelected = (index: number) => {
    const card = player.cards[index];
    setSelectedCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter((c) => c !== card);
      }
      return [...prev, card];
    });
  };

  const endGame = () => {
    handleEnd();
  };

  useEffect(() => {
    const allPass = players.every((p) => p.state === "PASS");
    if (allPass) {
      startNewHand();
      return;
    }
    const empty = players.find((p) => p.cards.length === 0);
    if (empty) {
      setWinner(hand.lastTurn);
    }
  }, [turn]);

  return (
    <div className="flex flex-col w-full flex-grow">
      <div className="flex gap-2 w-full p-4 my-2 justify-evenly">
        {players.map((pl, i) => {
          if (i === 0) return null;
          return (
            <div
              key={`player-${i}`}
              className={`${
                turn === i ? "border-4 border-cyan-100 rounded-lg" : ""
              }  flex flex-col items-center  p-4 lg:text-4xl`}>
              <p className="p-2 text-white font-bold">Player {i + 1}</p>
              <p className="p-2 text-white font-bold">{pl.cards.length}</p>
              <div
                className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg ${
                  pl.state === "PASS" ? "bg-red-500" : "bg-blue-200"
                } shadow`}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          minHeight: "350px",
        }}
        className="border-2 border-dotted border-black p-4 rounded-lg my-4 bg-green-400 flex flex-col">
        <p className="text-center font-bold p-2 text-lg lg:text-4xl">
          Current Turn Player {turn + 1}
        </p>
        <div className="flex gap-2 items-center justify-center w-full lg:text-xl">
          <button
            className={`${
              disablePlay ? "bg-gray-400" : "bg-blue-500"
            } font-bold text-white p-4 self-center rounded-lg hover:bg-blue-800`}
            disabled={disablePlay}
            onClick={playTurn}>
            Play
          </button>
          <button
            className={`${
              turn !== 0 ? "bg-gray-400" : "bg-blue-500"
            } p-4 self-center rounded-lg font-bold text-white hover:bg-blue-800`}
            disabled={turn !== 0}
            onClick={reveal}>
            Reveal
          </button>
          <button
            className={`${
              turn !== 0 ? "bg-gray-400" : "bg-blue-500"
            } p-4 self-center rounded-lg font-bold text-white hover:bg-blue-800`}
            disabled={turn !== 0}
            onClick={pass}>
            Pass
          </button>

          <button
            className={`${
              turn !== 0 || disablePlay ? "bg-gray-400" : "bg-blue-500"
            } p-4 self-center rounded-lg font-bold text-white hover:bg-blue-800`}
            disabled={turn !== 0 || disablePlay}
            onClick={reset}>
            Reset
          </button>
        </div>
        <div className="flex items-center w-full justify-evenly my-4 gap-2">
          {hand.cards.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xl text-center lg:text-2xl font-bold text-white">
                {hand.cards.length} {hand.type}
              </p>
              <div className="flex gap-2">
                {hand.cards.map((card, i) => {
                  return (
                    <div
                      key={`hand-${i}`}
                      className={`${
                        card.suit === "S" || card.suit === "C"
                          ? "text-black"
                          : "text-red-400"
                      } w-8 h-8 bg-blue-200 text-center font-bold text-lg lg:text-2xl`}>
                      {revealHand ? `${card.card}${card.suit}` : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {stack.length > 0 && (
            <div className="flex flex-col text-center items-center">
              <p className="text-xl lg:text-2xl font-bold text-white">
                Current Stack
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {stack.length}
              </p>
              <div className="w-8 h-8 bg-blue-200" />
            </div>
          )}
          {winner !== -1 && (
            <div className="flex flex-col items-center gap-2 my-4">
              <p className="text-xl font-bold text-white">Winner {winner}</p>
              <button
                className="bg-blue-200 self-center rounded-lg p-4 text-2xl font-bold"
                onClick={endGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {player.cards.map((card, i) => {
          const isSelected = selectedCards.includes(card);
          return (
            <button
              disabled={turn !== 0}
              onClick={() => addToSelected(i)}
              key={`card-${i}`}
              className={`${
                card.suit === "S" || card.suit === "C"
                  ? "text-black"
                  : "text-red-400"
              } ${
                isSelected ? "bg-yellow-200" : "bg-white"
              } p-2  rounded-2xl w-1/12 lg:w-1/10 font-bold text-center hover:bg-yellow-100`}>
              <img src={IMAGES[card.suit]} alt="" />
              <p className="text-xl lg:text-2xl font-bold pt-1">{card.card}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default Game;
