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
  const [result, setResult] = useState({
    gross: 0,
    net: 0,
    accuracy: 1,
  })
  const [wrongTypedWords, setWrongTypedWords] = useState([])
  const [fixedWords, setFixedWords] = useState(new Set())

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
    setResult({gross: 0, net: 0, accuracy: 1})
    setFixedWords(new Set())
    setWrongTypedWords([])


    counterRef.current.reset()
    wordsRendererRef.current.reset()
    inputRef.current.value = ""
  }

  const gameOver = () => {
    console.log("Game is Over!!!")
    setFinished(true);
  };


  const onTimeRun = (passedSeconds) => {
    renderResult(typedWords, passedSeconds)
  }

  const renderResult = (typedWords, passedSeconds) => {
    if (passedSeconds === 0) return;
    const gross = (typedWords.length / passedSeconds * 60).toFixed(2)
    const net = ((typedWords.length - wrongTypedWords.length) / passedSeconds * 60).toFixed(2)
    const accuracy = (1 - ((fixedWords.size + wrongTypedWords.length) / typedWords.length).toFixed(2))

    setResult({gross, net, accuracy})
  }

  const onTyping = (e) => {
    const value = inputRef.current.value || "";
    const keyPress = e.nativeEvent.data;
    const trimmedValue = value.trim();

    if (finished) return;

    if (keyPress === null) setFixedWords(prev => new Set([...prev, words[currentTypeWordIdx]]));

    if (keyPress === " " && trimmedValue !== "") {
      const isNiceDone = words[currentTypeWordIdx] === trimmedValue

      if (!isNiceDone) setWrongTypedWords(prev => [...prev, {word: words[currentTypeWordIdx], yourFault: trimmedValue}])

      inputRef.current.value = "";
      setCurrentTyping("");
      setCurrentTypeWordIdx((prev) => prev + 1);
      setTypedWords((prev) => [...prev, { word: trimmedValue, isNiceDone }]);
    } else {
      setCurrentTyping(trimmedValue);
    }

    if (!started) setStarted(true);
  };

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
        <input type="text" ref={inputRef} onChange={onTyping} autoComplete="off" />
        <CountdownClock
          isStarted={started}
          initialSecs={timeDuration}
          onTimeout={gameOver}
          onTick={(secs) => onTimeRun(secs)}
          counterRef={counterRef}
        />
        <button onClick={() => restart()}>Reset</button>
      </div>
      
      <div className="result">
        <span className="result-grossspeed">Gross: <b>{result.gross} WPM</b></span>
        <span className="result-netspeed">Net: <b>{result.net} WPM</b></span>
        <span className="result-accuracy"> Accuracy: <b>{result.accuracy * 100} %</b></span>
      </div>
    </div>
  );
}

export default App;
