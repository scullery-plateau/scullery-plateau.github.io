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
                oUtil.convertSVGtoBase64(svgData,(imageURL) => {
                    this.setState({ imageURL });
                });
                this.setState({ defaultFilename, placeholder: defaultFilename, width, height });
            });
        }
        render() {
            return <>
                <p>Feel free to enter a filename</p>
                <div className="form-group">
                <label className="text-light" htmlFor="imageDownloadFilename">
                    Filename
                </label>
                <input
                    type="text"
                    className="form-control rpg-textbox"
                    id="imageDownloadFilename"
                    placeholder={this.state.placeholder}
                    value={this.state.filename}
                    onChange={(e) => this.setState({ filename: e.target.value })}
                />
                </div>
                <img src={this.state.imageURL}/>
                <div className="justify-content-end">
                    <button
                        className="btn btn-info"
                        onClick={() => {
                            Utilities.triggerPNGDownload(this.state.filename,this.state.defaultFilename,this.state.imageURL);
                            this.onClose();
                        }}>Download & Close</button>
                    <button className="btn btn-danger" onClick={() => { this.onClose(); }}>Close</button>
                </div>
            </>;
        }
    }
});