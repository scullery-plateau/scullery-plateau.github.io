namespace('sp.outfitter.Explorer',{
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities': 'util',
    'sp.outfitter.LayerGrouper':'LayerGrouper'
},({ Dialog, FileDownload, LoadFile, util, LayerGrouper }) => {
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
            Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/apps/outfitter/datasets/${bodyType}2.json`,
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
                    <button className="btn btn-primary" onClick={() => this.loadSchematic()}>Load Schematic</button>
                    { assetNames.map((assetName) => {
                        return <button className="btn btn-primary" onClick={() => this.loadNew(assetName)}>Load Metadata '{assetName}'</button>
                    })}
                </div>;
            } else if (this.state.progress) {
                <div className="d-flex flex-column">
                    <p>Loading display configuration data, please wait....</p>
                    <div className="progress">
                        <div className="progress-bar" style={{width: `${this.state.progress}%`}}>{this.state.progress}%</div>
                    </div>
                </div>
            } else {
                return <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={() => this.ignoreSelected()}>Ignore Selected</button>
                        <button className="btn btn-primary" onClick={() => this.groupSelected()}>Group Selected</button>
                    </div>
                    <div className="d-flex justify-content-center">
                        { Object.keys(this.state.metadata).filter((imageIndex) => {
                            return !(imageIndex in this.state.schematic.ignored) && !(imageIndex in this.state.schematic.grouped);
                        }).map((imageIndex) => {
                            const layer = this.state.metadata[imageIndex];
                            const isSelected = this.state.selected[imageIndex];
                            return <div className="rpg-box m-2 p-2 d-flex flex-column">
                                <p>{imageIndex}</p>
                                <button className={`btn layer ${isSelected?"btn-outline-success border-5":""}`}  onClick={() => this.selectLayer(imageIndex)}>
                                    <svg viewBox={`0 0 ${layer.width} ${layer.height}`}>
                                        <g transform={`matrix(1,0,0,1,${layer.xOff},${layer.yOff})`} dangerouslySetInnerHTML={layer.paths}></g>
                                        <defs dangerouslySetInnerHTML={layer.defs}></defs>
                                    </svg>
                                </button>
                            </div>;
                        }) }
                    </div>
                </div>;
            }
        }
    }
});