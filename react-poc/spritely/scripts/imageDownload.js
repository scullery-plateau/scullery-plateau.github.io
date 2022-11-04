namespace('ImageDownload',["Utilities"],({Utilities}) => {
    const triggerDownload = function (fileName, defaultFilename, { pixels, palette, size, bgColor, isTransparent }) {
        const jsonData = { pixels, palette, size};
        if (!isTransparent) {
            jsonData.bgColor = bgColor;
        }
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(jsonData));
        const body = document.getElementsByTagName('body')[0];
        const link = document.createElement('a');
        body.appendChild(link);
        link.setAttribute('href', dataStr);
        link.setAttribute('download', normalizeFilename(fileName,".json",defaultFilename));
        link.click();
        body.removeChild(link);
    }
    const drawRect = function(ctx,color,coords) {
        ctx.fillStyle = color;
        ctx.fillRect.apply(ctx, coords);
    }
    const drawImageInCanvas = function (data, scale, imgDim, trimToImage) {
        let { offsetX, offsetY, width, height } = Utilities.calcTrimBounds(
            trimToImage,
            data.size,
            data.size,
            Object.keys(data.pixels),
            Utilities.parsePixelId
        );
        const canvasElem = document.createElement("canvas");
        canvasElem.setAttribute("width",(width * scale).toString());
        canvasElem.setAttribute("height",(height * scale).toString());
        canvasElem.setAttribute("style","border: 1px solid black")
        const ctx = canvasElem.getContext('2d');
        if (!data.isTransparent) {
            drawRect(ctx,data.bgColor,[0, 0, imgDim, imgDim]);
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelId = Utilities.getPixelId(x, y);
                if (pixelId in data.pixels) {
                    drawRect(ctx,data.palette[data.pixels[pixelId]],[scale * (x - offsetX), scale * (y - offsetY), scale, scale]);
                }
            }
        }
        const dataURL = canvasElem.toDataURL('image/png')
        return {dataURL, width, height, canvasElem};
    };
    const normalizeFilename = function (filename, ext, defaultFilename) {
        if (filename.endsWith(ext)) {
            filename = filename.replace(ext, '');
        }
        filename = encodeURIComponent(filename);
        if (filename.length === 0) {
            return defaultFilename;
        }
        return filename + ext;
    }
    const repaintImage = function(me, update) {
        const newState = Utilities.merge(me.state,update);
        const imgDim = me.appState.size * newState.scale;
        const download = normalizeFilename( newState.filename, '.png', me.defaultFilename );
        const moreUpdates = drawImageInCanvas(me.appState, newState.scale, imgDim, me.state.trimToImage);
        me.setState(Utilities.merge(newState,moreUpdates,{download}));
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.modal = props.modal;
            this.defaultFilename = props.defaultFilename;
            this.state = {
                dataURL: "",
                filename: this.defaultFilename,
                scale: 5,
                trimToImage: false
            };
            props.modal.setGetter(({ pixels, palette, size, bgColor, isTransparent }) => {
                this.appState = { pixels, palette, size, bgColor, isTransparent };
                repaintImage(this,{ width: size, height: size })
            });
        }
        /*
        <div ref={(elem) => {
            if (elem instanceof HTMLElement && this.state.canvasElem instanceof HTMLCanvasElement) {
                elem.innerHTML = "";
                elem.appendChild(this.state.canvasElem)
            }
        }}></div>
        */
        render() {
            return <div>
                <div className="form-group">
                    <label htmlFor="imageFileName">File Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.filename}
                        onChange={(e) => repaintImage(this, { filename: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageScale">Image Scale:</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={this.state.scale}
                        onChange={(e) => repaintImage(this,{ scale: e.target.value })}
                    />
                </div>
                <div className="form-check">
                    <label htmlFor="trimToImage" className="form-check-label">Trim To Image?</label>
                    <input type="checkbox"
                           className="form-check-input"
                           checked={ this.state.trimToImage }
                           onChange={(e) => repaintImage(this,{ trimToImage: e.target.checked })}/>
                </div>
                <p>Click on the image to download.</p>
                {
                    (["scale","width","height"].reduce((out,key) => {
                        return out && !isNaN(this.state[key]);
                    },true)) &&
                    <div>
                        <a href={ this.state.dataURL } title="click image to download" download={ this.state.download }>
                            <img alt="image" src={ this.state.dataURL } style={{
                                width: this.state.scale * this.state.width,
                                height: this.state.scale * this.state.height,
                                border: "1px solid black"
                            }}/>
                        </a>
                    </div>
                }
                <div>
                    <button className={'btn btn-success'} onClick={ () => {
                        triggerDownload(this.state.filename, this.defaultFilename, this.appState);
                        this.modal.close();
                    }}>Download</button>
                    <button className={'btn btn-danger'} onClick={ () => this.modal.close() }>Cancel</button>
                </div>
            </div>;
        }
    }
});