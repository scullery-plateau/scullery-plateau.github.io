namespace('sp.svengali.Svengali',{
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Dialog':'Dialog',
    'sp.common.Header':'Header'
},() => {
    const sizeUnits = "mm";
    const cardSize = { min: 64, max: 89 };
    const pageSize = { min: 216, max: 279 };
    const buildTemplateFn = function(columns, markdown) {
        return eval("({" + columns.join(",") + "}) => marked.parse(`" + markdown + "`)");
    }
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {};
        }
        loadDatafile() {

        }
        buildSpecField(label, fieldName, opts){
            return util.buildNumberInputGroup(fieldName, label, opts, () => {
                return this.state.spec[fieldName];
            }, (value) => {
                this.updateSpec(fieldName,parseFloat(value));
            });
        }
        buildColorPickerButton(label, fieldName) {
            return <button 
                className="btn"
                style={{
                }}
                onClick={() => {}}
                onDoubleClick={() => {}}
                onContextMenu={() => {}}
                >{label}</button>
        }
        render() {
            return <>
                { !this.state.datatable &&
                  <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                            this.loadDatafile();
                        }}>Load Data File</button>
                  </div> }
                { this.state.datatable &&
                  <div className="rpg-box text-light m-1 d-flex justify-content-center">
                    <div className="d-flex flex-column">
                        <div className="d-flex">
                            <select>
                                { this.state.layers.map((layer,index) => {
                                    return <option value={index}>{this.layerLabel(layer)}</option>
                                }) }
                            </select>
                        </div>
                        <div className="d-flex">
                            <select>
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                            </select>
                        </div>
                        <div className="d-flex">
                            <textarea></textarea>
                        </div>
                        <div className="d-flex">
                            <select>
                                { Object.keys(this.state.columns).map((column) => {
                                    return <option value={column}>{column}</option>;
                                }) }
                            </select>
                        </div>
                        <div className="d-flex">
                            { this.buildSpecField("X","x",{}) }
                            { this.buildSpecField("Y","y",{}) }
                        </div>
                        <div className="d-flex">
                            { this.buildSpecField("Width","width",{}) }
                            { this.buildSpecField("Height","height",{}) }
                        </div>
                        <div className="d-flex">
                            { this.buildSpecField("RX","rx",{}) }
                            { this.buildSpecField("RY","ry",{}) }
                        </div>
                        <div className="d-flex">
                            { this.buildColorPickerButton("Fill","fill") }
                            { this.buildColorPickerButton("Line","line") }
                        </div>
                        <div className="d-flex">
                            { this.buildSpecField("Line Width","strokeWidth",{}) }
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex">
                            <select>
                                { this.state.datatable.map((row) => {
                                    return <option value={row[this.state.rowLabel]}>{row[this.state.rowLabel]}</option>
                                }) }
                            </select>
                        </div>
                        <div className="d-flex">
                        </div>
                      </div>
                  </div> }
            </>;
        }
    }
});