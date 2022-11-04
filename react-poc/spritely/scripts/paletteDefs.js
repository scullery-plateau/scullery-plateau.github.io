namespace("PaletteDefs",{"Utilities":"U","Constants":"C"},({U,C}) => {
    const drawPaletteDef = function (color,id) {
        return <rect key={id} id={id} width="10" height="10" strokeWidth="1" stroke="black" fill={color}/>;
    };
    return function(props) {
        return <svg width="0" height="0">
            <defs>
                { drawPaletteDef(props.state.bgColor,C.bgColorPixelId()) }
                { props.state.palette.map((c,i) => drawPaletteDef(c,U.getPaletteId(i))) }
            </defs>
        </svg>;
    };
});