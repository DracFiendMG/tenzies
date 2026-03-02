export default function Die(props) {
    const pips = []
    for (let i = 0; i < props.value; i++) {
        pips.push(<span key={i} className="pip" />)
    }

    const dieClasses = `die face-${props.value}`

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    return (
        // <button 
        //     style={styles}
        //     onClick={props.hold}
        //     aria-pressed={props.isHeld}
        //     aria-label={`Die with value ${props.value}, 
        //     ${props.isHeld ? "held" : "not held"}`}
        // >{props.value}</button>
        <div 
            style={styles}
            onClick={props.hold}
            className={dieClasses}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >
            {pips}
        </div>
    )
}