  namespace('sp.cobblestone.Cobblestone',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.GridUtilities': 'gUtil',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities': 'util',
    'sp.cobblestone.CobblestoneUtil': 'cUtil',
    'sp.cobblestone.DimensionSetter': 'DimensionSetter',
    'sp.cobblestone.Download': 'Download',
    'sp.cobblestone.Publish': 'Publish',
    'sp.cobblestone.TileDefs': 'TileDefs',
    'sp.cobblestone.TileEditor': 'TileEditor',
},({ buildAbout, Dialog, FileDownload, Header, LoadFile, TileDefs, TileEditor, gUtil, util, cUtil, Publish, Download, DimensionSetter }) => {
    const tileDim = cUtil.getTileDim();
    const emptyCellId = gUtil.getEmptyCellId();
    const about = [
        'Cobblestone is a canvas for game boards and battle maps.',
        'Build your map a page at a time. Publish them as printable or download them as images.',
        'Import images as tiles, flip or rotate them to your desired orientation, and arrange them as you wish.'
    ];
    const getTransforms = {
        shiftRight: () => (x, y) => [x + 1, y],
        shiftLeft: () => (x, y) => [x - 1, y],
        shiftUp: () => (x, y) => [x, y - 1],
        shiftDown: () => (x, y) => [x, y + 1],
    };
    const validateLoadFileJson = function() {};
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                images: {},
                tiles: {},
                placements: {},
                orientation: 'portrait',
                printOrientation: 'portrait',
                size: {
                    min: 8,
                    max: 10
                }
            };
            this.modals = Dialog.factory({
                about: {
                    componentClass: buildAbout("Cobblestone",about),
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                fileDownload: {
                    componentClass: FileDownload,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                imageDownload: {
                    componentClass: Download,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                sizeOrientation: {
                    componentClass: DimensionSetter,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: ({ size, orientation }) => {
                        this.setState({ size, orientation });
                    }
                },
                publish: {
                    componentClass: Publish,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: ({ pages, printOrientation }) => {
                        this.setState({ pages, printOrientation });
                    }
                },
                tileEditor: {
                    componentClass: TileEditor,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: ({filename,tiles}) => {
                        const copiedTiles = Object.entries(this.state.tiles).reduce((out,[k,v]) => {
                            out[k] = util.merge(v);
                            return out;
                        }, {});
                        copiedTiles[filename] = util.merge(tiles);
                        this.setState({ tiles: copiedTiles });
                    }
                }
            })
            this.menuItems = [{
                id: 'fileMenu',
                label: 'File',
                items: [{
                    id: 'loadFile',
                    label: 'Load File',
                    callback: () => {
                        LoadFile(
                            false,
                            'text',
                            (fileContent) => {
                                const jsonData = JSON.parse(fileContent);
                                const { images, tiles, placements, size, orientation, pages, printOrientation } = jsonData;
                                const stateData = { images, tiles, placements, size, orientation, pages, printOrientation };
                                const error = validateLoadFileJson(stateData);
                                if (error) {
                                    throw error;
                                }
                                const [filename, tfs] = Object.entries(tiles)[0];
                                const firstTF = Object.keys(tfs)[0];
                                stateData.selectedTile = [filename, firstTF];
                                this.setState(stateData);
                            },
                            (fileName, error) => {
                                console.log({ fileName, error });
                                alert(fileName + ' failed to load. See console for error.');
                            }
                          );
                    },
                },{
                    id: 'downloadFile',
                    label: 'Download File',
                    callback: () => {
                        const { images, tiles, placements, size, orientation, pages, printOrientation } = this.state;
                        this.modals.fileDownload.open({
                            defaultFilename:"cobblestone",
                            jsonData:{ images, tiles, placements, size, orientation, pages, printOrientation }
                        });
                    }
                },{
                    id: 'downloadImage',
                    label: 'Download Image',
                    callback: () => {
                        this.modals.imageDownload.open(this.state);
                    }
                },{
                    id: 'publish',
                    label: 'Publish',
                    callback: () => {
                        this.modals.publish.open(this.state);
                    }
                }]
            },{
                id: 'sizeOrientationMenu',
                label: 'Set Size & Orientation',
                callback: () => {
                    const { size, orientation } = this.state;
                    this.modals.sizeOrientation.open({ size, orientation });
                },
            },{
                id: 'transformMenu',
                label: 'Transform',
                items: [
                  ['shiftLeft', 'Shift Left'],
                  ['shiftRight', 'Shift Right'],
                  ['shiftUp', 'Shift Up'],
                  ['shiftDown', 'Shift Down'],
                ].map(([id, label]) => {
                  return {
                    id: `transform-${id}`,
                    label,
                    callback: () => {
                      this.transform(id);
                    },
                  };
                }),
            },{
                id: 'about',
                label: 'About',
                callback: () => {
                    this.modals.about.open();
                },
            }];
        }
        transform(transformType) {
            const width = gUtil.getWidth(this.state.size,this.state.orientation);
            const height = gUtil.getHeight(this.state.size,this.state.orientation);
            const transformFn = getTransforms[transformType]();
            const placements = Object.entries(this.state.placements).reduce(
              (out, [pixelId, tile]) => {
                const { x, y } = gUtil.parseCoordinateId(pixelId);
                const [x1, y1] = transformFn(x, y);
                if (x1 >= 0 && x1 < width && y1 >= 0 && y1 < height) {
                  const newPixelId = gUtil.getCoordinateId(x1, y1);
                  out[newPixelId] = tile;
                }
                return out;
              },
              {}
            );
            this.setState({ placements });
        }
        addImage() {
            LoadFile(
              true,
              'dataURL',
              (dataURL, filename) => {
                  const images = util.merge(this.state.images);
                  const tiles = util.merge(this.state.tiles);
                  images[filename] = dataURL;
                  tiles[filename] = { '': true };
                  this.setState({ images, tiles });
              },
              (filename, error) => {
                  console.log({ filename, error });
                  alert(filename + ' failed to load. See console for error.');
              }
            );
        }
        editTile(filename) {
            this.modals.tileEditor.open({ filename, dataURL: this.state.images[filename], tiles: this.state.tiles[filename] });
        }
        toggleTile(x,y) {
            if (this.state.selectedTile) {
                const placements = util.merge(this.state.placements);
                const coordId = gUtil.getCoordinateId(x, y);
                const tile = placements[coordId];
                if (tile) {
                    delete placements[coordId];
                } else {
                    placements[coordId] = this.state.selectedTile.map(st => st);
                }
                this.setState({placements});
            }
        }
        render() {
            const width = gUtil.getWidth(this.state.size, this.state.orientation);
            const height = gUtil.getHeight(this.state.size, this.state.orientation);
            const fullWidth = width * tileDim;
            const fullHeight = height * tileDim;
            return <>
                <Header menuItems={this.menuItems} appTitle={'Cobblestone'} />
                <TileDefs tiles={this.state.tiles} images={this.state.images} tileDim={tileDim}/>
                <h4 className="text-center">Click <a href="resources/delian.zip">here</a> to download an example!</h4>
                <div className="rpg-title-box m-3 d-flex justify-content-between" title="Palette" >
                    <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
                    <div className="ml-2 w-100 d-flex flex-nowrap tile-buttons">
                        { Object.entries(this.state.tiles).map(([filename, transforms]) => {
                            return Object.keys(transforms).map((tf) => {
                                const tileRef = cUtil.getTileId(filename, tf);
                                return <button
                                    key={`btn.${tileRef}.key`}
                                    id={`btn.${tileRef}`}
                                    className={'tile m-2 p-0'+
                                    (Array.isArray(this.state.selectedTile) && this.state.selectedTile[0] === filename && this.state.selectedTile[1] === tf
                                        ? ' selected-tile'
                                        : '')}
                                    title={`Tile: ${filename}, ${tf}; click to select, double click or right click to edit`}
                                    onClick={ () => this.setState({ selectedTile: [ filename, tf] }) }
                                    onDoubleClick={ () => {
                                        this.editTile(filename)
                                    }}
                                    onContextMenu={ (e) => {
                                        e.preventDefault();
                                        this.editTile(filename);
                                    }}>
                                    <svg key={`btn.${tileRef}.svg.key`} width="100%" height="100%" viewBox={`0 0 ${tileDim} ${tileDim}`}>
                                        <use href={`#${tileRef}`}/>
                                    </svg>
                                </button>;
                            });
                        }) }
                    </div>
                </div>
                <div className="rpg-title-box m-3" title="click to place a tile" >
                    <svg key="svg-canvas" width="100%" height="75%" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${fullWidth} ${fullHeight}`}>
                    {
                        util.range(width).map((x) => {
                            return util.range(height).map((y) => {
                                const tile = this.state.placements[gUtil.getCoordinateId(x, y)];
                                const tileId = tile ? cUtil.getTileId(tile[0], tile[1]) : emptyCellId;
                                return <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    this.toggleTile(x,y)
                                }}>
                                    <use x={tileDim * x} y={tileDim * y} href={`#${tileId}`} stroke="black" strokeWidth="2"/>
                                </a>;
                            });
                        })
                    }
                    </svg>
                </div>
            </>;
        }
    }
});