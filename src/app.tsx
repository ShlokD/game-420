import { useState } from "preact/hooks";
import "./app.css";
import Game from "./game";
import Rules from "./rules";
enum Gamestate {
  INIT,
  PLAY,
}
export function App() {
  const [appState, setAppState] = useState(Gamestate.INIT);
  const [decks, setDecks] = useState(1);
  const handleStart = () => {
    setAppState(Gamestate.PLAY);
  };

  const handleEnd = () => {
    setAppState(Gamestate.INIT);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="p-6 bg-black text-white font-bold text-4xl">
        <h1 className="text-center">420 Game</h1>
      </header>
      <main className="bg-gray-500 p-2 w-full flex flex-col flex-grow">
        {appState === Gamestate.INIT && (
          <Rules handleStart={handleStart} decks={decks} setDecks={setDecks} />
        )}
        {appState === Gamestate.PLAY && (
          <Game decks={decks} handleEnd={handleEnd} />
        )}
      </main>
      <footer className="p-4 bg-black text-white font-bold sticky bottom-0 w-full">
        Built with Preact
      </footer>
    </div>
  );
}
