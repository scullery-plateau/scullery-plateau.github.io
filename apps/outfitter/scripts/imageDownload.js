namespace('sp.outfitter.ImageDownload',{
    'sp.common.Utilities':'Utilities',
    'sp.outfitter.OutfitterUtil':'oUtil'
},({ Utilities, oUtil }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.onClose = props.onClose;
            props.setOnOpen(({ defaultFilename, svgData }) => {
                console.log(svgData);
                const { width, height } = svgData;
                const imageURL = oUtil.convertSVGtoBase64(svgData,(canvasURL) => {
                    console.log({ canvasURL });
                    this.setState({ canvasURL });
                });
                this.setState({ defaultFilename, imageURL, placeholder: defaultFilename, width, height });
            });
        }
        render() {
            return <>
                <p>Feel free to enter a filename</p>
                {  this.state.canvasURL &&
                <div className="form-group">
                    <label className="text-light form-label" htmlFor="imageDownloadFilename">
                        Filename
                    </label>
                    <input
                        type="text"
                        className="form-control rpg-textbox"
                        id="imageDownloadFilename"
                        placeholder={this.state.placeholder}
                        value={this.state.filename}
                        style={{ width: "15em" }}
                        onChange={(e) => this.setState({ filename: e.target.value })}
                    />
                </div> }
                { this.state.canvasURL && <img src={this.state.canvasURL}/> }
                <div className="justify-content-end">
                    { this.state.canvasURL && 
                        <button
                            className="btn btn-info"
                            onClick={() => {
                                Utilities.triggerPNGDownload(this.state.filename,this.state.defaultFilename,this.state.imageURL);
                                this.onClose();
                            }}>Download & Close</button> }
                    <button className="btn btn-danger" onClick={() => { this.onClose(); }}>Close</button>
                </div>
            </>;
        }
    }
});