namespace("sp.cobblestone.TileDefs",{
    "sp.cobblestone.CobblestoneUtil":"cUtil"
},({cUtil}) => {
    return function(props) {
        return <svg key="tiledefs" width="0" height="0">
            <defs>
                <rect id={cUtil.getBlankCellId()} width={props.tileDim} height={props.tileDim} fill="none"/>
                <rect id={cUtil.getEmptyCellId()} width={props.tileDim} height={props.tileDim} fill="url(#clearedGradient)"/>
                { Object.entries(props.tiles||{}).map(([filename, transforms]) => {
                    return Object.keys(transforms)
                    .map((tf) => {
                        const id = cUtil.getTileId(filename, tf);
                        const href = this.state.images[filename];
                        const tfs = cUtil.buildImageTransform(tf);
                        return <image id={id} href={href} width={props.tileDim} height={props.tileDim} transform={tfs}/>;
                    });
                }) }
            </defs>
        </svg>;
    }
});