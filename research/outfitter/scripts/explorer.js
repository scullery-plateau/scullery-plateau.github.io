namespace('sp.outfitter.Explorer',{
    'sp.common.Ajax': 'Ajax',
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.ProgressBar': 'ProgressBar',
    'sp.common.Utilities': 'util',
    'sp.outfitter.LayerGrouper':'LayerGrouper'
},({ Ajax, Dialog, FileDownload, LoadFile, ProgressBar, util, LayerGrouper }) => {
    const assetNames = [
        'animated-1',
        'animated-2',
        'animated-3',
        'animated-4',
        'animated-1-old',
        'animated-2-old',
        'animated-3-old',
        'animated-4-old',
        'heromatic'
    ];
    const validateLoadFileJson = function(data){};
    const getDefaultSchematic = function(assetName) {
        return {
            assetName,
            ignored:{},
            partCount:{},
            grouped:{}
        }
    };
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                groupLayers:{
                    templateClass: LayerGrouper,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                }
            });
        }
        loadMeta(assetName,schematic) {
            this.setState({schematic, progress: 1, selected: {}});
            Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/research/outfitter/assets/${assetName}.json`,
            {
                success: (responseText) => {
                    const metadata = JSON.parse(responseText);
                    this.setState({ metadata, progress: undefined, selected: {}});
                },
                failure: (resp) => {
                    console.log(resp);
                    throw resp;
                },
                stateChange: (state) => {
                    const progress = (100 * (state.state + 1)) / (state.max + 1);
                    this.setState({progress})
                }
            });
        }
        loadSchematic() {
            LoadFile(
                false,
                'text',
                (fileContent) => {
                  const schematic = JSON.parse(fileContent);
                  const error = validateLoadFileJson(schematic);
                  if (error) {
                    throw error;
                  }
                  this.loadMeta(schematic.assetName,schematic);
                },
                (fileName, error) => {
                  console.log({ fileName, error });
                  alert(fileName + ' failed to load. See console for error.');
                });
        }
        loadNew(assetName) {
            this.loadMeta(assetName,getDefaultSchematic(assetName));
        }
        render() {
            if (!this.state.schematic) {
                return <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex flex-wrap justify-content-center">
                        <button className="btn btn-primary p-2 m-2" onClick={() => this.loadSchematic()}>Load Schematic</button>
                    </div>
                    <div className="d-flex flex-wrap justify-content-center">
                        { assetNames.map((assetName) => {
                            return <button className="btn btn-primary p-2 m-2" onClick={() => this.loadNew(assetName)}>Load Metadata '{assetName}'</button>
                        })}
                    </div>
                </div>;
            } else if (this.state.progress) {
                return <ProgressBar subject="metadata" progress={this.state.progress}/>
            } else {
                return <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary m-2" onClick={() => this.ignoreSelected()}>Ignore Selected</button>
                        <button className="btn btn-primary m-2" onClick={() => this.groupSelected()}>Group Selected</button>
                    </div>
                    <div className="d-flex justify-content-center flex-wrap">
                        { Object.keys(this.state.metadata).filter((imageIndex) => {
                            return !(imageIndex in this.state.schematic.ignored) && !(imageIndex in this.state.schematic.grouped);
                        }).map((imageIndex) => {
                            const layer = this.state.metadata[imageIndex];
                            const isSelected = this.state.selected[imageIndex];
                            return (<div className="rpg-box m-2 p-2 d-flex flex-column">
                                <p>{imageIndex}</p>
                                <button className={`btn layer ${isSelected?"btn-outline-success border-5":""}`}  onClick={() => this.selectLayer(imageIndex)}>
                                    <svg viewBox={`0 0 ${layer.width} ${layer.height}`}>
                                        <g transform={`matrix(1,0,0,1,${layer.xOff},${layer.yOff})`} dangerouslySetInnerHTML={{ __html:layer.paths}}></g>
                                        <defs dangerouslySetInnerHTML={{ __html:layer.defs}}></defs>
                                    </svg>
                                </button>
                            </div>);
                        }) }
                    </div>
                </div>;
            }
        }
    }
});