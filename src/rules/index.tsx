import { SetStateAction } from "preact/compat";

type RulesProps = {
  decks: number;
  setDecks: SetStateAction<number>;
  handleStart: () => void;
};

const Rules = ({ decks, setDecks, handleStart }: RulesProps) => {
  const doStartGame = () => {
    handleStart();
  };
  return (
    <div className="flex flex-col w-full items-center flex-grow p-4">
      <h2 className="font-bold text-white text-4xl">Rules</h2>
      <ul className="list pl-0 text-2xl font-bold text-white flex flex-col gap-2 my-8">
        <li> The game has 4 players</li>
        <li>
          The game starts with all cards of one or multiple decks dealt to all
          players
        </li>
        <li>The first player with the ace of spades starts the game</li>
        <li>
          At each turn, a player puts down a number of cards on the stack and
          claims that all cards belong to the same type. e.g. 4 Kings or 3 Nines
          and so on.
        </li>
        <li>
          The next player can add cards on top of the stack. They can either add
          the same card type or add different cards and make a bluff. If the
          player does not want to do either, they can pass their turn
        </li>
        <li>
          Also, if the next player thinks that the previously played hand is a
          bluff, they can ask to flip the cards of the previous hand
        </li>
        <li>
          If the flip reveals a bluff, the player who played the last hand gets
          all the cards that have been put down. If not, the one who asked for
          the reveal gets the cards
        </li>
        <li>If all players pass their turn, the current stack is discarded</li>
        <li>The first player to empty their deck wins</li>
      </ul>
      <div className="flex gap-4 items-end w-full">
        <div className="flex flex-col w-1/3">
          <label className="text-xs text-white font-bold">
            Number of decks
          </label>
          <input
            id="decks"
            className="text-2xl p-4 text-center"
            type="number"
            value={decks}
            onChange={(ev) =>
              setDecks(Number((ev?.target as HTMLInputElement)?.value))
            }
            aria-label="Number of decks"
          />
        </div>

        <button
          onClick={doStartGame}
          className="w-2/3 bg-blue-400 p-4 text-white rounded-lg font-bold text-2xl">
          Start
        </button>
      </div>
    </div>
  );
};

export default Rules;
