namespace('sp.cobblestone.Cobblestone',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities': 'util',
    'sp.cobblestone.TileEditor': 'TileEditor',
    'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ buildAbout, Dialog, Header, LoadFile, TileEditor, util, cUtil }) => {
    const tileDim = 30;
    const emptyCellId = 'emptyCell';
    const about = [
        'Cobblestone is a canvas for game boards and battle maps.',
        'Build your map a page at a time. Publish them as printable or download them as images.',
        'Import images as tiles, flip or rotate them to your desired orientation, and arrange them as you wish.'
    ];
    const tileTransforms = {
        flipDown: `matrix(1 0 0 -1 0 ${tileDim})`,
        flipOver: `matrix(-1 0 0 1 ${tileDim} 0)`,
        turnLeft: `rotate(-90,${tileDim / 2},${tileDim / 2})`,
        turnRight: `rotate(90,${tileDim / 2},${tileDim / 2})`,
    };
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
                tileEditor: {
                    templateClass: TileEditor,
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
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
                    },
                },{
                    id: 'downloadImage',
                    label: 'Download Image',
                    callback: () => {
                    },
                },{
                    id: 'publishPrintable',
                    label: 'Publish Printable',
                    callback: () => {
                    },
                }]
            },{
                id: 'sizeMenu',
                label: 'Size',
                groupClassName: 'size-picker',
                getter: () => this.state.size,
                setter: (size) => {
                    this.setState({ size });
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
                this.setState({ orientation });
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
        addImage() {}
        getTileID(filename, tf) {
            return [filename].concat(tf.split(',')).join('.');
        };
        editTile(filename) {
            this.modals.tileEditor.open({ filename, context:this.state });
        }
        width(size) {
          return (this.state.orientation === 'portrait')?size.min:size.max;
        }
        height(size) {
          return (this.state.orientation === 'portrait')?size.max:size.min;
        }
        render() {
            const width = this.width(this.state.size);
            const height = this.height(this.state.size);
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
                                          const tfs = tf.split(',').map((t) => tileTransforms[t]).join(' ');
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
                    {
                        /* canvas */
                        util.range().map((x) => {
                            return util.range(this.height(this.state.size)).map((y) => {
                                let tile = data.placements[cUtil.getCoordinateId(x, y)];
                                let tileId = tile ? this.getTileID(tile[0], tile[1]) : emptyCellId;
                                return <a href="#" onClick={() => this.toggleTile(x,y)}>
                                    <use x={tileDim * x} y={tileDim * y} href={`#${tileId}`} stroke="black" strokeWidth="2"/>
                                </a>;
                            });
                        })
                    }
                </div>
            </>;
        }
    }
});