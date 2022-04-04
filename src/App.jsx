import { useState, useRef } from "react";
import "./index.css";
import { generateRandomWords } from "./lib/words";
import CountdownClock from "./components/CountdownClock";
import WordsRenderer from "./components/WordsRenderer";

function App() {
  const [currentTypeWordIdx, setCurrentTypeWordIdx] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [timeDuration, setTimeDuration] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [words, setWords] = useState(() => {
    const shuffledWords = generateRandomWords();
    return shuffledWords;
  });

  const inputRef = useRef();
  const counterRef = useRef({})
  const wordsRendererRef = useRef({})

  const restart = () => {
    const shuffledWords = generateRandomWords()

    setWords(shuffledWords)
    setTypedWords([])
    setCurrentTyping("")
    setCurrentTypeWordIdx(0)
    setStarted(false)
    setFinished(false)
    counterRef.current.reset()
    wordsRendererRef.current.reset()
    inputRef.current.value = ""
  }

  const gameOver = () => {
    console.log("game is over")
    setFinished(true);
    console.log(typedWords)
  };

  const renderResult = () => {

  }

  const onTyping = (e) => {
    const value = inputRef.current.value || "";
    const keyPress = e.nativeEvent.data;
    const trimmedValue = value.trim();

    if (finished) return;

    if (keyPress === " " && trimmedValue !== "") {
      inputRef.current.value = "";
      setCurrentTyping("");
      setCurrentTypeWordIdx((prev) => prev + 1);
      setTypedWords((prev) => [...prev, trimmedValue]);
    } else {
      setCurrentTyping(trimmedValue);
    }

    if (!started) setStarted(true);
  };
  console.log("render")

  return (
    <div className="app">
      <div className="words-renderer">
        {
          finished && 
          (
            <div className="finish-banner">
              <div className="banner-text">
                Game is over!
              </div>
            </div>
          )
        }
        <WordsRenderer
          words={words}
          currentTyping={currentTyping}
          currentTypeWordIdx={currentTypeWordIdx}
          typedWords={typedWords}
          wordsRendererRef={wordsRendererRef}
        />
      </div>

      <div className="controller">
        <input type="text" ref={inputRef} onChange={onTyping} />
        <CountdownClock
          isStarted={started}
          initialSecs={timeDuration}
          onTimeout={gameOver}
          counterRef={counterRef}
        />
        <button onClick={() => restart()}>Reset</button>
      </div>
      
      <div className="result">{typedWords.length / timeDuration * 60} wpm</div>
    </div>
  );
}

export default App;
