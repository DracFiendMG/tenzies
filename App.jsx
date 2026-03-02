import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [rollCounter, setRollCounter] = useState(0)
    const [timeCounter, setTimeCounter] = useState("00:00")
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeCounter(oldTime => beautifyTime(oldTime))
        }, 1000)

        if (gameWon) {
            buttonRef.current.focus()
        }

        return () => {
            clearInterval(interval)
        }
    }, [gameWon])

    function beautifyTime(seconds) {
        const [mins, secs] = seconds.split(":").map(Number)
        const totalSeconds = mins * 60 + secs + 1
        const newMins = Math.floor(totalSeconds / 60)
        const newSecs = totalSeconds % 60
        
        return `${newMins < 10 ? "0" : ""}${newMins}:${newSecs < 10 ? "0" : ""}${newSecs}`
    }

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setRollCounter(prevCount => prevCount + 1)
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setRollCounter(0)
            setTimeCounter("00:00")
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <div className="counter">
                <span>Roll Count: {rollCounter}</span>
                <span>Time Consumed: {timeCounter}</span>
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}