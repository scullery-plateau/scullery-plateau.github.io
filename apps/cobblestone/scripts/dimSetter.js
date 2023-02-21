namespace("sp.cobblestone.DimensionSetter",{
    "sp.common.Utilities": "util",
    "sp.common.GridUtilities": "gUtil",
    "sp.cobblestone.CobblestoneUtil": 'cUtil'
},({ cUtil, gUtil, util }) => {
    const tileDim = cUtil.getTileDim();
    const emptyCellId = gUtil.getEmptyCellId();
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                width: 8,
                height: 10,
                orientation: 'portrait'
            }
            this.onClose = props.onClose;
            props.setOnOpen(({size,orientation}) => {
                const width = gUtil.getWidth(size,orientation);
                const height = gUtil.getHeight(size,orientation);
                this.setState({width,height,orientation})
            });
        }
        getOutput({width,height,orientation}) {
            return {
                size: {
                    min: Math.min(width,height),
                    max: Math.max(width,height)
                },
                orientation
            };
        }
        getOrientation(width,height) {
            if (width > height) {
                return 'landscape';
            } else {
                return 'portrait';
            }
        }
        render() {
            return <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column">
                        <h5>Set Size & Orientation:</h5>
                        <div className="form-group">
                            <label htmlFor="width">Width:</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                className="form-control"
                                id="width"
                                style={{ width: "4em" }}
                                value={ this.state.width }
                                onChange={(e) => {
                                    const width = parseInt(e.target.value);
                                    const orientation = this.getOrientation(width,this.state.height);
                                    this.setState({ width, orientation });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="height">Height:</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                className="form-control"
                                id="height"
                                style={{ width: "4em" }}
                                value={ this.state.height }
                                onChange={(e) => {
                                    const height = parseInt(e.target.value);
                                    const orientation = this.getOrientation(this.state.width,height);
                                    this.setState({ height, orientation });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="orientation">Orientation:</label>
                            <select id="orientation" value={ this.state.orientation } onChange={ (e) => {
                                const newState = {
                                    orientation:e.target.value,
                                    width:this.state.width,
                                    height:this.state.height
                                };
                                if (newState.orientation !== this.state.orientation) {
                                    const temp = newState.width;
                                    newState.width = newState.height;
                                    newState.height = temp;
                                }
                                this.setState(newState);
                            } }>
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>
                    </div>
                    <svg width="40%" height="80%" viewBox={`0 0 ${this.state.width * tileDim} ${this.state.height * tileDim}`}>
                        {
                            util.range(this.state.height).map((y) => {
                                return util.range(this.state.width).map((x) => {
                                    return <use x={tileDim * x} y={tileDim * y} href={`#${emptyCellId}`} stroke="black" strokeWidth="2"/>
                                })
                            })
                        }
                    </svg>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-success" onClick={ () => this.onClose(this.getOutput(this.state)) }>Apply</button>
                    <button className="btn btn-danger" onClick={ () => this.onClose() }>Cancel</button>
                </div>
            </div>;
        }
    }
});