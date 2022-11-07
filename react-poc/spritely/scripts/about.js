namespace("About",() => {
    const about = [
        "Spritely is a canvas for pixel art.",
        "Build your palette below, then select a color in the palette to paint pixels that color, or to unpaint pixels already that color.",
        "Changing the color of a slot in the palette will change the color of all matching pixels.",
        "Deleting a color will unpaint all pixels that matching color.",
        "Unpainting pixels will return them to the background color."];
    return function(props) {
        return <>
            <h3>About Spritely...</h3>
            {about.map((p,i) => <p key={`about-${i}`}>{p}</p>)}
            <div className="d-flex justify-content-end"><button className="btn btn-info" onClick={ () => props.onClose() }>OK</button></div>
        </>;
    }
})