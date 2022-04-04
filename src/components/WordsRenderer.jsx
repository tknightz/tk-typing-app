import { useState, useEffect, useRef, forwardRef } from "react"

const Word = forwardRef(({isCurrent, isWrong, isTyped, value}, ref) => {
  const classStates = []

  if (isCurrent) classStates.push("typing")
  if (isWrong) classStates.push("wrong")
  if (isTyped) classStates.push("typed")
  if (isTyped && !isWrong) classStates.push("nice-done")

  return (
    <p className={`word-generated ${classStates.join(' ')}`} ref={ref}>{value}</p>
  )
})



function WordsRender({words, typedWords, currentTypeWordIdx, currentTyping, wordsRendererRef}){
  const [offset, setOffset] = useState(0)
  const currentWordRef = useRef()

  useEffect(() => {
    if (currentWordRef.current){
      setOffset(currentWordRef.current.offsetTop)
    }
  }, [currentWordRef.current?.offsetTop])

  useEffect(() => {
    wordsRendererRef.current.reset = reset
  }, [wordsRendererRef?.current])

  const reset = () => {
    setOffset(0)
  }

  const checkWordIsWrong = (idx) => {
    if (idx > currentTypeWordIdx) return false;
    if (idx === currentTypeWordIdx) return !words[idx].includes(currentTyping);

    return words[idx] !== typedWords[idx]
  }

  return (
    <div className="word-wrapper">
      <div className="text-to-type" style={{transform: `translateY(-${offset}px)`}}>
        { words.map((word, wordIdx) => {
          const idx = wordIdx
          return (<Word ref={currentTypeWordIdx === idx ? currentWordRef : null} isTyped={idx < currentTypeWordIdx} isCurrent={currentTypeWordIdx === idx} isWrong={checkWordIsWrong(idx, word)} key={idx} value={word} />)
        })
        }
      </div>
    </div>
  )
}

export default WordsRender;
