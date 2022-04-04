import { useState, useEffect, useRef } from 'react'
import { forwardRef } from 'react/cjs/react.production.min'
import "./index.css"
import { words } from "./words"

const NUM_OF_WORDS_PER_LINE = 13

function generateRandomWords(){
  const shuffledWords = words 
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  return shuffledWords
}

function wordsToLines(words){
  const lineSize = NUM_OF_WORDS_PER_LINE
  const lines = []

  for(let i = 0; i < words.length; i += lineSize){
    lines.push(words.slice(i, i + lineSize))
  }

  return lines
}

const Word = forwardRef(({isCurrent, isWrong, value}, ref) => {
  const classStates = []

  if (isCurrent) classStates.push("typing")
  if (isWrong) classStates.push("wrong")

  return (
    <p className={`word-generated ${classStates.join(' ')}`} ref={ref}>{value}</p>
  )
})

function App() {
  const [currentTypeWordIdx, setCurrentTypeWordIdx] = useState(0)
  const [words, setWords] = useState([])
  const [lines, setLines] = useState([])
  const [typedWords, setTypedWords] = useState("")
  const [currentTyping, setCurrentTyping] = useState("")

  const inputRef = useRef()
  const currentWordRef = useRef()

  useEffect(() => {
    const shuffledWords = generateRandomWords()
    const lines = wordsToLines(shuffledWords)
    setWords(shuffledWords)
    setLines(lines)
  }, [])


  const checkWordIsWrong = (idx, word) => {
    if (idx > currentTypeWordIdx) return false;
    if (idx === currentTypeWordIdx) return !words[idx].includes(currentTyping);

    console.log(word, currentTyping, word.includes(currentTyping))

    return !words[idx].includes(typedWords[idx])
  }

  const onTyping = (e) => {
    const value = inputRef.current.value || ""
    const keyPress = e.nativeEvent.data
    const trimmedValue = value.trim()

    if (keyPress === " " && trimmedValue !== ""){
      inputRef.current.value = ""
      setCurrentTyping("")
      setCurrentTypeWordIdx((prev) => prev + 1)
      setTypedWords((prev) => [...prev, trimmedValue])
    } else {
      setCurrentTyping(trimmedValue)
    }
    console.log(currentWordRef.current)
  }

  return (
    <div className="app">
      {
        words && (
        <div className="word-wrapper">
          <div className="text-to-type">
            { words.map((word, wordIdx) => {
                const idx = wordIdx
                return (<Word ref={currentWordRef} isCurrent={currentTypeWordIdx === idx} isWrong={checkWordIsWrong(idx, word)} key={idx} value={word} />)
              })
            }
          </div>
        </div>
        )
      }
      <input type="text" ref={inputRef} onChange={onTyping} />
    </div>
  )
}

export default App
