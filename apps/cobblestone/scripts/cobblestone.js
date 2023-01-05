namespace('sp.cobblestone.Cobblestone',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities': 'util',
    'sp.cobblestone.CobblestoneUtil': 'cUtil',
    'sp.cobblestone.Download': 'Download',
    'sp.cobblestone.Publish': 'Publish',
    'sp.cobblestone.TileEditor': 'TileEditor',
},({ buildAbout, Dialog, Header, LoadFile, TileEditor, util, cUtil, Publish, Download }) => {
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
                download: {
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
                    id: 'download',
                    label: 'Download',
                    callback: () => {
                        this.modals.download.open(this.state);
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
                    return { label: `${this.width(value)} x ${this.height(value)}`, value };
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
            const width = this.width(this.state.size);
            const height = this.height(this.state.size);
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
                  tiles[filename][''] = true;
                  this.setState({ images, tiles });
              },
              (filename, error) => {
                  console.log({ filename, error });
                  alert(filename + ' failed to load. See console for error.');
              }
            );
        }
        getTileID(filename, tf) {
            return [filename].concat(tf.split(',')).join('.');
        };
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
            return <>
                <Header menuItems={this.menuItems} appTitle={'Cobblestone'} />
                <div className="rpg-title-box m-3 d-flex justify-content-between" title="Palette" >
                    <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
                    <div className="ml-2 w-100 d-flex flex-nowrap">
                        <svg width="0" height="0">
                            <defs>
                                <rect id={emptyCellId} width={tileDim} height={tileDim} fill="url(#clearedGradient)"/>
                                { Object.entries(this.state.tiles).map(([filename, transforms], index) => {
                                    return Object.keys(transforms)
                                      .map((tf) => {
                                          const id = this.getTileID(filename, tf);
                                          const href = this.state.images[filename];
                                          const tfs = tf.split(',').map((t) => cUtil.getTileTransform(t)).join(' ');
                                          return <image id={id} href={href} width={tileDim} height={tileDim} transform={tfs}/>;
                                      });
                                }) }
                            </defs>
                        </svg>
                        { Object.entries(this.state.tiles).map(([filename, transforms]) => {
                                return Object.keys(transforms).map((tf) => {
                                    const tileRef = this.getTileID(filename, tf);
                                    return <button
                                      id={`btn.${tileRef}`}
                                      className={'tile m-2 p-0'+
                                        (this.state.selectedTile[0] === filename && this.state.selectedTile[1] === tf
                                          ? ' selected-tile'
                                          : '')}
                                      title="click to select, double click or right click to edit"
                                      onClick={ () => this.setState({ selectedTile: [ filename, tf] }) }
                                      onDblClick={ () => this.editTile(filename) }
                                      contextMenu={ (e) => {
                                          e.preventDefault();
                                          this.editTile(filename);
                                      }}
                                    >
                                        <svg width="100%" height="100%" viewBox={`0 0 ${tileDim} ${tileDim}`}>
                                            <use href={`#${tileRef}`}/>
                                        </svg>
                                    </button>;
                                });
                            }) }
                    </div>
                </div>
                <div className="rpg-title-box m-3" title="click to place a tile" >
                    <svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${width * tileDim} ${height * tileDim}`}>
                    {
                        util.range(width).map((x) => {
                            return util.range(height).map((y) => {
                                const tile = this.state.placements[cUtil.getCoordinateId(x, y)];
                                const tileId = tile ? this.getTileID(tile[0], tile[1]) : emptyCellId;
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