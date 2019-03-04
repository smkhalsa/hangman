import React, {
  useState,
  useMemo,
  useEffect,
  EventHandler,
  SyntheticEvent
} from "react";
import randomWords from "random-words";

import image1 from "./images/hang0.gif";
import image2 from "./images/hang1.gif";
import image3 from "./images/hang2.gif";
import image4 from "./images/hang3.gif";
import image5 from "./images/hang4.gif";
import image6 from "./images/hang5.gif";

const images = [image1, image2, image3, image4, image5, image6];
const maxIncorrect = images.length - 1;

enum GameState {
  Playing,
  Won,
  Lost
}

export default () => {
  // State

  const [words, setWords] = useState<Array<string>>(
    randomWords({ min: 1, max: 3 })
  );

  const [guessed, setGuessed] = useState<{ [key: string]: boolean }>({});

  // Computed State

  const incorrectLetters = useMemo(() => {
    return Object.keys(guessed).filter(
      letter => !words.join("").includes(letter)
    );
  }, [words, guessed]);

  const gameState = useMemo(() => {
    if (incorrectLetters.length >= maxIncorrect) {
      return GameState.Lost;
    } else if (
      words
        .join("")
        .split("")
        .every(letter => guessed[letter])
    ) {
      return GameState.Won;
    } else {
      return GameState.Playing;
    }
  }, [words, guessed, incorrectLetters]);

  // State Change Handlers

  const handleKeyPress = (e: any) => {
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    setGuessed(prev => {
      prev[e.key] = true;
      return { ...prev };
    });
  };

  const handleNewWord = () => {
    setGuessed({});
    setWords(randomWords({ min: 1, max: 3 }));
  };

  // Effects

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <header className="App-header">
        {gameState === GameState.Lost && <h1>You Lost :(</h1>}
        {gameState === GameState.Won && <h1>You won! :)</h1>}
        <p>{maxIncorrect - incorrectLetters.length} guesses remaining</p>
        <img
          src={images[incorrectLetters.length] || images[images.length - 1]}
        />
      </header>
      <p>
        {words
          .join(" ")
          .split("")
          .map((letter, i) => (
            <span
              key={i}
              style={{
                margin: 10,
                fontSize: 24
              }}
            >
              {letter === " " ? letter : guessed[letter] ? letter : "_"}
            </span>
          ))}
      </p>
      <h4>Incorrect:</h4>
      {incorrectLetters.map(letter => (
        <span key={letter} style={{ margin: 10 }}>
          {letter}
        </span>
      ))}
      {gameState !== GameState.Playing && (
        <button
          style={{ display: "block", padding: 10, marginTop: 50 }}
          onClick={handleNewWord}
        >
          Play Again
        </button>
      )}
    </div>
  );
};
