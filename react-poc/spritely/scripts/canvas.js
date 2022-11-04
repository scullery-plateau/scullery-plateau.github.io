namespace('Canvas', {"Utilities":"Util","Constants":"C"},({Util,C}) => {
    const range = function(size) {
        return Array(size).fill("").map((e,i) => i);
    }
    const drawPixel = function(x,y,pixelId,paletteOption,callback) {
        return <a key={pixelId} href="#" onClick={ (e) => {
            e.preventDefault();
            callback(pixelId);
        } }>
          <use id={pixelId} x={x* C.pixelDim()} y={y * C.pixelDim()} href={paletteOption}/>
        </a>
    }
    const getColorId = function(pixel,altColor) {
        if (isNaN(pixel)) {
            return `#${altColor}`
        } else {
            return `#${Util.getPaletteId(pixel)}`
        }
    }
    return function(props) {
        return <svg
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMin meet"
            viewBox={`0 0 ${props.state.size * C.pixelDim()} ${props.state.size * C.pixelDim()}`}>
            {
                range(props.state.size).map(y => {
                    return range(props.state.size).map(x => {
                        const pixelId = Util.getPixelId(x,y);
                        return drawPixel(x,y,pixelId,getColorId(props.state.pixels[pixelId],props.state.isTransparent?props.state.clearedPixelId:C.bgColorPixelId()),props.togglePixelColor)
                    });
                })
            }
        </svg>;
    };
});