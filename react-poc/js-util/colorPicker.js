namespace('ColorPicker',["Utilities","Colors"],({Utilities,Colors}) => {
    const hexFromXY = function (x, y) {
        const r = 3 * Math.floor(x / 6) + Math.floor(y / 6);
        const g = x % 6;
        const b = y % 6;
        return Utilities.hexFromRGB.apply(null,[r, g, b].map((c) => {
            c *= 3;
            return c + c * 16;
        }));
    };
    const setRGB = function(hexColor) {
        const rgb = Utilities.rgbFromHex(hexColor);
        if (rgb) {
            rgb.hex = hexColor;
            return rgb;
        }
    }
    const setColorPart = function(state, colorPart, colorValue) {
        const newState = Utilities.merge(state);
        newState[colorPart] = colorValue;
        newState.hex = Utilities.hexFromRGB(newState.red, newState.green, newState.blue);
        return newState;
    }
    const buildInitState = function() {
        return {
            hex: "",
            red: 0,
            green: 0,
            blue: 0
        }
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = buildInitState();
            props.setOnOpen(({color, index}) => {
                this.setState(setRGB(color));
                this.index = index;
            });
            this.onClose = props.onClose;
        }
        render() {
            return <div className="d-flex justify-content-center color-picker">
                <div className="p-2">
                    <table style={{padding: 0, margin: 0}}>
                        <tbody>
                        {
                            Array(18).fill("").map((_,y) => {
                                return <tr key={`row${y}`} style={{padding:0,margin:0}}>{
                                    Array(12).fill("").map((_,x) => {
                                        const hex = hexFromXY(x,y);
                                        return <td key={`cell${hex}`} style={{padding: 0, margin: 0}}>
                                            <button key={hex}
                                                style={{ color: hex, backgroundColor: hex}}
                                                onClick={ () => {
                                                    this.setState(setRGB(hex))
                                                } }
                                            >_</button>
                                        </td>
                                    })
                                }</tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex flex-column p-2">
                    <p className="rounded-lg" style={{color:this.state.hex,backgroundColor:this.state.hex}}>__</p>
                    <div className="form-group">
                        <label htmlFor="hexColor">Color Hexcode:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="hexColor"
                            value={this.state.hex}
                            onChange={((e) => {
                                this.setState(setRGB(e.target.value)) })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="colorByName">Color by Name:</label>
                        <select
                            id="colorByName"
                            className="form-control"
                            value={this.state.hex}
                            onChange={((e) => {
                                this.setState(setRGB(e.target.value)) })}
                        >
                            <option value={undefined}>Select</option>
                            {Object.keys(Colors).sort().map((colorName) => {
                            const hex = Colors[colorName];
                            return <option key={colorName} value={hex} style={{
                                color:Utilities.getForegroundColor(hex),
                                backgroundColor:hex
                            }}>{colorName}</option>;
                        })}</select>
                    </div>
                    <hr/>
                    <div className="d-flex">
                        <div className="form-group">
                            <label htmlFor="redColor">Red:</label>
                            <input
                                type="number"
                                min="0"
                                max="255"
                                className="form-control"
                                id="redColor"
                                value={this.state.red}
                                onChange={((e) => {
                                    this.setState(setColorPart(this.state,"red", e.target.value)) })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="greenColor">Green:</label>
                            <input
                                type="number"
                                min="0"
                                max="255"
                                className="form-control"
                                id="greenColor"
                                value={this.state.green}
                                onChange={((e) => {
                                    this.setState(setColorPart(this.state, "green", e.target.value)) })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="blueColor">Blue:</label>
                            <input
                                type="number"
                                min="0"
                                max="255"
                                className="form-control"
                                id="blueColor"
                                value={this.state.blue}
                                onChange={((e) => {
                                    this.setState(setColorPart(this.state, "blue", e.target.value)) })}
                            />
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <button className="btn btn-info" onClick={ () => this.onClose({color:this.state.hex,index:this.index}) }>Use Color</button>
                        <button className="btn btn-secondary" onClick={ () => this.onClose() }>Cancel</button>
                    </div>
                </div>
            </div>;
        }
    }
});