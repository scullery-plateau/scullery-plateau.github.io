namespace("Spritely",[
    "Canvas","Palette","PaletteDefs","SizePickerMenu","Menues","Utilities","Constants","LoadFile"
],({Canvas,Palette,PaletteDefs,SizePickerMenu,Menues,Utilities,Constants,LoadFile}) => {
    const validateLoadFileJson = function (data) {}
    const getTransforms = {
        turnLeft: (size) => ((x,y) => [y, (size - 1) - x]),
        turnRight: (size) => ((x,y) => [(size - 1) - y, x]),
        flipOver: (size) => ((x,y) => [(size - 1) - x, y]),
        flipDown: (size) => ((x,y) => [x, (size - 1) - y]),
        shiftRight: () => ((x,y) => [x + 1, y]),
        shiftLeft: () => ((x,y) => [x - 1, y]),
        shiftUp: () => ((x,y) => [x, y - 1]),
        shiftDown: () => ((x,y) => [x, y + 1]),
    };
    return class Spritely extends React.Component {
        constructor(props) {
            super(props);
            this.modals = props.modals;
            this.state = {
                palette:[],
                pixels:{},
                size:16,
                selectedPaletteIndex:-1,
                isTransparent: true,
                clearedPixelId: props.clearedPixelId,
                bgColor: Constants.defaultColor()
            };
            this.modals.colorPicker.setSetter(({color,index}) => {
                const palette = Array.from(this.state.palette);
                palette[index] = color;
                this.setState({ palette, selectedPaletteIndex: index });
            });
            this.modals.bgColorPicker.setSetter(({color}) => {
                this.setState({ bgColor: color });
            });
        }
        loadFile(){
            LoadFile(false,"text",(fileContent) => {
                const jsonData = JSON.parse(fileContent);
                const error = validateLoadFileJson(jsonData);
                if (error) {
                    throw error;
                }
                jsonData.isTransparent = !('bgColor' in jsonData);
                jsonData.size = jsonData.size || 16;
                this.setState(jsonData);
            },
            (fileName,error) => {
                console.log({fileName,error});
                alert(fileName + " failed to load. See console for error.")
            });
        }
        transform(transformType){
            const size = this.state.size;
            const transformFn = getTransforms[transformType](size);
            const pixels = Object.entries(this.state.pixels).reduce((out,[pixelId,paletteIndex]) => {
                const { x, y } = Utilities.parsePixelId(pixelId);
                const [ x1, y1 ] = transformFn(x,y);
                if (x1 >= 0 && x1 < size && y1 >= 0 && y1 < size) {
                    const newPixelId = Utilities.getPixelId(x,y);
                    out[newPixelId] = paletteIndex;
                }
                return out;
            },{});
            this.setState({ pixels });
        }
        togglePixelColor(pixelId) {
            if (this.state.selectedPaletteIndex >= 0) {
                const pixels = Utilities.merge(this.state.pixels)
                if (pixels[pixelId] === this.state.selectedPaletteIndex) {
                    delete pixels[pixelId];
                } else {
                    pixels[pixelId] = this.state.selectedPaletteIndex;
                }
                this.setState({ pixels });
            }
        }

        menuItem(label,callback) {
            return <a
                href="react-poc/spritely/scripts/spritely#" className="dropdown-item" onClick={ (e) => {
                    e.preventDefault();
                    callback();
                    Menues.closeMenus();
                }}>{label}</a>;
        }

        render() {
            return <div className="container">
                <div className="navbar d-flex justify-content-start">
                    <div className="menu-root">
                        <ul className="navbar-nav">
                            <li className="nav-item active drowpdown">
                                <a href="react-poc/spritely/scripts/spritely#" className="rpg-box p-3 text-light nav-link dropdown-toggle" onClick={(e) => { Menues.toggleMenu(e) }}></a>
                                <ul className="dropdown-menu rpg-box">
                                    <li className="dropdown-submenu">
                                        <a href="react-poc/spritely/scripts/spritely#" className="dropdown-item dropdown-toggle" onClick={(e) => { Menues.toggleMenu(e) }}>File</a>
                                        <ul className="dropdown-menu rpg-box">
                                            <li>{this.menuItem("Load File", () => { this.loadFile() })}</li>
                                            <li>{this.menuItem("Download", () => { this.modals.imageDownload.open(this.state) })}</li>
                                        </ul>
                                    </li>
                                    <li className="dropdown-submenu">
                                        <a href="react-poc/spritely/scripts/spritely#" className="dropdown-item dropdown-toggle" onClick={(e) => { Menues.toggleMenu(e) }}>Size</a>
                                        <ul className="dropdown-menu rpg-box size-picker">
                                            <SizePickerMenu setSize={size => { this.setState({ size }); }} options={[16,32,48]}/>
                                        </ul>
                                    </li>
                                    <li className="dropdown-submenu">
                                        <a href="react-poc/spritely/scripts/spritely#" className="dropdown-item dropdown-toggle" onClick={(e) => { Menues.toggleMenu(e) }}>Transform</a>
                                        <ul className="dropdown-menu rpg-box">
                                            {[
                                                ["Turn Left", () => { this.transform('turnLeft'); }],
                                                ["Turn Right", () => { this.transform('turnRight'); }],
                                                ["Flip Over", () => { this.transform('flipOver'); }],
                                                ["Flip Down", () => { this.transform('flipDown'); }],
                                                ["Shift Left", () => { this.transform('shiftLeft'); }],
                                                ["Shift Right", () => { this.transform('shiftRight'); }],
                                                ["Shift Up", () => { this.transform('shiftUp'); }],
                                                ["Shift Down", () => { this.transform('shiftDown'); }]
                                            ].map(([label,callback],i) => {
                                                return <li key={`transform${i}`}>{this.menuItem(label, callback)}</li>
                                            })}
                                        </ul>
                                    </li>
                                    <li id="about">{this.menuItem("About", () => { this.modals.about.open() })}</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <a href="../../index.html" className="navbar-brand text-light">Scullery Plateau:</a>
                    <span className="navbar-brand">Spritely</span>
                </div>
                <div className="d-flex justify-content-center rpg-box m-3">
                    <button className="rounded w-25" style={{
                        backgroundColor: this.state.bgColor,
                        color:Utilities.getForegroundColor(this.state.bgColor)
                    }} onClick={(index) => {
                        this.modals.bgColorPicker.open({color: this.state.bgColor})}}>BG Color</button>
                    <span className="m-3"></span>
                    <button className={`rounded w-25 btn ${this.state.isTransparent?'btn-outline-light':'btn-dark'}`} onClick={ () => {
                        this.setState({ isTransparent: !this.state.isTransparent })
                    }}>{this.state.isTransparent?'Transparent':'Opaque'}</button>
                </div>
                <div className="rpg-box m-3 d-flex justify-content-between" title="Palette">
                    <button className="btn btn-success" title="Add Color" onClick={ () => {
                        const selectedPaletteIndex = this.state.palette.length;
                        const palette = [].concat(this.state.palette,[Constants.defaultColor()]);
                        this.setState({ palette, selectedPaletteIndex });
                    }}>+</button>
                    <div className="ml-2 w-100 d-flex flex-wrap">
                        <Palette state={ this.state } selectColor={ (index) => {
                            this.setState({selectedPaletteIndex: index})
                        } } setColor={ (index) => {
                            this.modals.colorPicker.open({index, color: this.state.palette[index]});
                        } }/>
                    </div>
                    <button className="btn btn-danger" title="Remove Color" onClick={ () => {
                        const palette = Array.from(this.state.palette);
                        palette.splice(this.state.selectedPaletteIndex);
                        const selectedPaletteIndex = Math.min(this.state.selectedPaletteIndex,palette.length - 1);
                        this.setState({ palette, selectedPaletteIndex });
                    }}>X</button>
                </div>
                <div className="rpg-title-box m-3" title="click to paint a pixel">
                    <Canvas state={this.state} togglePixelColor={ (pixelId) => this.togglePixelColor(pixelId) }/>
                </div>
                <div style={{display: "none"}}>
                    <PaletteDefs state={this.state}/>
                </div>
            </div>;
        }
    }
});