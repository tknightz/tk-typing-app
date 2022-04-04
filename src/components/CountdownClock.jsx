import { memo } from "react";
import { useState, useEffect } from 'react'

function CountdownClock({initialSecs=0, onTimeout, isStarted, counterRef}){
  const [seconds, setSeconds] = useState(initialSecs)
  const [finished, setFinished] = useState(initialSecs <= 0)
  let counter = null

  useEffect(() => {
    if (isStarted){
      counter = setInterval(tick, 1000);
    }

    return () => {
      clearInterval(counter)
    }
  }, [isStarted])

  useEffect(() => {
    if (finished && onTimeout) onTimeout()
  }, [finished])

  const tick = () => {
    setSeconds((prev) => {
      if (prev === 1){
        clearInterval(counter)
        setFinished(true)
        return 0
      }

      return prev - 1
    })
  }

  useEffect(() => {
    counterRef.current.reset = reset
  }, [counterRef?.current])

  const reset = () => {
    setSeconds(initialSecs)
    setFinished(initialSecs <= 0)
  }

  const formatTime = (secs) => {
    const _minutes = Math.floor(secs / 60)
    const _seconds =  ( secs - _minutes * 60 ) % 60

    const minutes = _minutes < 10 ? `0${_minutes}` : _minutes
    const seconds = _seconds < 10 ? `0${_seconds}` : _seconds

    return `${minutes} : ${seconds}`
  }

  return (
    <span className="counter">{formatTime(seconds)}</span>
  )
}

export default memo(CountdownClock)
