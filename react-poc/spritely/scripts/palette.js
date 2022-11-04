namespace('Palette',{"Utilities":"U"},({U}) => {
    return function(props) {
        return <>
            { props.state.palette.map((c,i) => {
                const id = U.getPaletteButtonId(i);
                return <button
                    key={id} id={id}
                    className={`palette-color rounded-pill mr-2 ml-2${(i === props.state.selectedPaletteIndex ? ' selected-color' : '')}`}
                    title="click to select, double click or right click to change this color"
                    style={{color: c, backgroundColor: c}}
                    onClick={ () => props.selectColor(i) }
                    onDoubleClick={ () => props.setColor(i) }
                    onContextMenu={ (e) => {
                        e.preventDefault();
                        props.setColor(i); }}>----</button> })}
        </>;
    };
});