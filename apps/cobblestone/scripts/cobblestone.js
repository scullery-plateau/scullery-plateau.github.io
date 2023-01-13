  namespace('sp.cobblestone.Cobblestone',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities': 'util',
    'sp.cobblestone.CobblestoneUtil': 'cUtil',
    'sp.cobblestone.Download': 'Download',
    'sp.cobblestone.Publish': 'Publish',
    'sp.cobblestone.TileDefs': 'TileDefs',
    'sp.cobblestone.TileEditor': 'TileEditor',
},({ buildAbout, Dialog, FileDownload, Header, LoadFile, TileDefs, TileEditor, util, cUtil, Publish, Download }) => {
    const tileDim = cUtil.getTileDim();
    const emptyCellId = cUtil.getEmptyCellId();
    const about = [
        'Cobblestone is a canvas for game boards and battle maps.',
        'Build your map a page at a time. Publish them as printable or download them as images.',
        'Import images as tiles, flip or rotate them to your desired orientation, and arrange them as you wish.'
    ];
    const sizes = [{
      min:25,
      max:25
    }];
    const validateLoadFileJson = function() {};
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                images: {},
                tiles: {},
                placements: {},
                orientation: 'portrait',
                size: sizes[0],
                selectedTile: []
            };
            this.modals = Dialog.factory({
                about: {
                    templateClass: buildAbout("Cobblestone",about),
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                fileDownload: {
                    templateClass: FileDownload,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                imageDownload: {
                    templateClass: Download,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                },
                publish: {
                    templateClass: Publish,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: ({ pages }) => {
                        this.setState({ pages });
                    }
                },
                tileEditor: {
                    templateClass: TileEditor,
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
                        this.loadFile();
                    },
                },{
                    id: 'downloadFile',
                    label: 'Download File',
                    callback: () => {
                        const { images, tiles, placements, size, orientation, pages } = this.state;
                        this.modals.fileDownload.open({
                            defaultFilename:"cobblestone",
                            state:{ images, tiles, placements, size, orientation, pages }
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
                id: 'sizeMenu',
                label: 'Size',
                groupClassName: 'size-picker',
                getter: () => this.state.size,
                setter: (size) => {
                    this.reframePlacements({ size });
                },
                options: sizes.map((value) => {
                    return { label: `${cUtil.getWidth(value,this.state.orientation)} x ${cUtil.getHeight(value,this.state.orientation)}`, value };
                }),
            },{
              id: 'orientationMenu',
              label: 'Orientation',
              groupClassName: 'size-picker',
              getter: () => this.state.orientation,
              setter: (orientation) => {
                  this.reframePlacements({ orientation });
              },
              options: ['Portrait','Landscape'].map((value) => {
                return { label: value, value: value.toLowerCase() };
              }),
            },{
                id: 'about',
                label: 'About',
                callback: () => {
                    this.modals.about.open();
                },
            }];
        }
        loadFile() {
            LoadFile(
              false,
              'text',
              (fileContent) => {
                  const jsonData = JSON.parse(fileContent);
                  const error = validateLoadFileJson(jsonData);
                  if (error) {
                      throw error;
                  }
                  this.setState(jsonData);
              },
              (fileName, error) => {
                  console.log({ fileName, error });
                  alert(fileName + ' failed to load. See console for error.');
              }
            );
        }
        reframePlacements(update) {
            const width = cUtil.getWidth(this.state.size,this.state.orientation);
            const height = cUtil.getHeight(this.state.size,this.state.orientation);
            const placements = util.range(width).reduce((acc,x) => {
                return util.range(height).reduce((out,y) => {
                    const coordId = cUtil.getCoordinateId(x,y);
                    const placement = this.state.placements[coordId];
                    if (placement) {
                        out[coordId] = placement;
                    }
                    return out;
                }, acc);
            }, {});
            this.setState(util.merge(update,{ placements }));
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
        width(size) {
          return (this.state.orientation === 'portrait')?size.min:size.max;
        }
        height(size) {
          return (this.state.orientation === 'portrait')?size.max:size.min;
        }
        toggleTile(x,y) {
            if (this.state.selectedTile) {
                const placements = util.merge(this.state.placements);
                const coordId = cUtil.getCoordinateId(x, y);
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
            const width = cUtil.getWidth(this.state.size, this.state.orientation);
            const height = cUtil.getHeight(this.state.size, this.state.orientation);
            const fullWidth = width * tileDim;
            const fullHeight = height * tileDim;
            console.log({tileDim, width, height, fullWidth, fullHeight})
            return <>
                <Header menuItems={this.menuItems} appTitle={'Cobblestone'} />
                <div className="rpg-title-box m-3 d-flex justify-content-between" title="Palette" >
                    <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
                    <div className="ml-2 w-100 d-flex flex-nowrap">
                        <TileDefs tiles={this.state.tiles} images={this.state.images} tileDim={tileDim}/>
                        { Object.entries(this.state.tiles).map(([filename, transforms]) => {
                                return Object.keys(transforms).map((tf) => {
                                    const tileRef = cUtil.getTileId(filename, tf);
                                    return <button
                                      key={`btn.${tileRef}.key`}
                                      id={`btn.${tileRef}`}
                                      className={'tile m-2 p-0'+
                                        (this.state.selectedTile[0] === filename && this.state.selectedTile[1] === tf
                                          ? ' selected-tile'
                                          : '')}
                                      title="click to select, double click or right click to edit"
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
                    <svg key="svg-canvas" width="100%" height="100%" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${fullWidth} ${fullHeight}`}>
                    {
                        util.range(width).map((x) => {
                            return util.range(height).map((y) => {
                                const tile = this.state.placements[cUtil.getCoordinateId(x, y)];
                                const tileId = tile ? cUtil.getTileId(tile[0], tile[1]) : emptyCellId;
                                return <a href="#" onClick={() => this.toggleTile(x,y)}>
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