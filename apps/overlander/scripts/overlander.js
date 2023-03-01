namespace('sp.overlander.Overlander',{
    'sp.common.BuildAbout':'buildAbout',
    'sp.common.Dialog':'Dialog',
    'sp.common.FileDownload':'FileDownload',
    'sp.common.GridUtilities': 'gUtil',
    'sp.common.Header':'Header',
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Utilities':'util',
    'sp.overlander.OverlanderUtil': 'oUtil',
    'sp.overlander.DimensionSetter': 'DimensionSetter',
    'sp.overlander.Download': 'Download',
    'sp.overlander.Publish': 'Publish',
    'sp.overlander.Tile': 'Tile',
    'sp.overlander.TileDefs': 'TileDefs',
    'sp.overlander.TileEditor': 'TileEditor',
},({ buildAbout, Dialog, FileDownload, Header, LoadFile, gUtil, util, oUtil, Publish, Download, DimensionSetter, Tile, TileDefs, TileEditor }) => {
    const { columnWidth, tileHeight, extraWidth, tileWidth, columnOffset } = Tile.getConstants();
    const about = [];
    const validateLoadFileJson = function() {};
    const emptyCellId = gUtil.getEmptyCellId();
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              tiles: [],
              placements: {},
              orientation: 'portrait',
              printOrientation: 'portrait',
              size: {
                min: 9,
                max: 11
              }
            };
            this.modals = Dialog.factory({
                about: {
                  templateClass: buildAbout("Overlander",about),
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
                sizeOrientation: {
                  templateClass: DimensionSetter,
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: ({ size, orientation }) => {
                    this.setState({ size, orientation });
                  }
                },
                publish: {
                  templateClass: Publish,
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: ({ pages, printOrientation }) => {
                    this.setState({ pages, printOrientation });
                  }
                },
                tileEditor: {
                  templateClass: TileEditor,
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: ({ tile }) => {
                    const copiedTiles = this.state.tiles.map(tile => util.merge(tile));
                    copiedTiles[tile.index] = util.merge(tile);
                    this.setState({ tiles: copiedTiles });
                  }
                }
            });
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
                      const firstTF = Object.keys(tfs);
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
                    defaultFilename:"overlander",
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
              }
            },{
              id: 'about',
              label: 'About',
              callback: () => {
                this.modals.about.open();
              }
            }];
        }
        addImage() {
          LoadFile(
            true,
            'dataURL',
            (imageURL, filename) => {
              Tile.loadTile(filename, imageURL, (tile) => {
                const tiles = this.state.tiles.map(tile => util.merge(tile));
                tiles.push(tile);
                this.setState({ tiles });
              });
            },
            (filename, error) => {
              console.log({ filename, error });
              alert(filename + ' failed to load. See console for error.');
            }
          );
        }
        editTile(index) {
          this.modals.tileEditor.open({
            tile: util.merge(this.state.tiles[index])
          });
        }
        toggleTile(x,y) {
          if (this.state.selectedTile) {
            const placements = util.merge(this.state.placements);
            const coordId = oUtil.getCoordinateId(x, y);
            const tile = placements[coordId];
            if (tile) {
              delete placements[coordId];
            } else {
              placements[coordId] = this.state.selectedTile;
            }
            this.setState({placements});
          }
        }
        render() {
            const width = gUtil.getWidth(this.state.size, this.state.orientation);
            const height = gUtil.getHeight(this.state.size, this.state.orientation);
            const fullWidth = width * columnWidth + extraWidth;
            const fullHeight = height * tileHeight + columnOffset;
            return <>
                <Header menuItems={this.menuItems} appTitle={'Overlander'} />
                <TileDefs tiles={this.state.tiles}/>
              <div className="rpg-title-box m-3 d-flex justify-content-between" title="Palette" >
                <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
                <div className="ml-2 w-100 d-flex flex-nowrap tile-buttons">
                  { Object.entries(this.state.tiles).map((tile,index) => {
                      return <button
                        key={`btn.tile${index}.key`}
                        id={`btn.tile${index}`}
                        className={'tile.js m-2 p-0'+ (this.state.selectedTile === index ? ' selected-tile.js' : '')}
                        title={`Tile: ${tile.filename}; click to select, double click or right click to edit`}
                        onClick={ () => this.setState({ selectedTile: index }) }
                        onDoubleClick={ () => {
                          this.editTile(index)
                        }}
                        onContextMenu={ (e) => {
                          e.preventDefault();
                          this.editTile(index);
                        }}>
                        <svg key={`btn.tile${index}.svg.key`} width="100%" height="100%" viewBox={`0 0 ${tileHeight} ${tileWidth}`}>
                          <use href={`#tile${index}`}/>
                        </svg>
                      </button>;
                  }) }
                </div>
              </div>
              <div className="rpg-title-box m-3" title="click to place a tile" >
                <svg key="svg-canvas" width="100%" height="75%" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${fullWidth} ${fullHeight}`}>
                  {
                    util.range(width).map((x) => {
                      return util.range(height).map((y) => {
                        const tileIndex = this.state.placements[gUtil.getCoordinateId(x, y)];
                        const tileId = !isNaN(tileIndex) ? `tile${tileIndex}` : emptyCellId;
                        return <a href="#" onClick={(e) => {
                          e.preventDefault();
                          this.toggleTile(x,y)
                        }}>
                          <use x={columnWidth * x} y={tileHeight * y + (columnOffset * (x % 2))} href={`#${tileId}`}/>
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