namespace('sp.cobblestone.Cobblestone',{
  'sp.common.Dialog': 'Dialog',
  'sp.common.FileDownload': 'FileDownload',
  'sp.common.GridHighlighter': 'GridHighlighter',
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
},({ Dialog, FileDownload, GridHighlighter, Header, LoadFile, TileDefs, TileEditor, gUtil, util, cUtil, Publish, Download, DimensionSetter }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const tileDim = cUtil.getTileDim();
  const emptyCellId = gUtil.getEmptyCellId();
  const highlighterFrameId = "highlighterFrame";
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
  const transformLabels = [
    ['shiftLeft', 'Shift Left', 'fa-arrow-left'],
    ['shiftRight', 'Shift Right', 'fa-arrow-right'],
    ['shiftUp', 'Shift Up', 'fa-arrow-up'],
    ['shiftDown', 'Shift Down', 'fa-arrow-down'],
  ];
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
            this.loadFile();
          },
        },{
          id: 'downloadFile',
          label: 'Download File',
          callback: () => {
            this.downloadFile();
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
            console.log({ publishState: this.state });
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
        items: transformLabels.map(([id, label]) => {
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
          Dialog.alert({ label: "Cobblestone", lines: about });
        },
      }];
      GridHighlighter.init({
        squareSize: tileDim,
        highlighterFrameId,
        outlineColor: "red", 
        outlineWidth: 2, 
        allowDragEvents: (() => this.state.selectedTile),
        onOutOfBounds:(() => {}),
        onDrop:((startId, ids) => {
          const placements = util.merge(this.state.placements);
          const setNewState = (placements[startId])?((placements, coordId) => {
            delete placements[coordId];
          }):((placements, coordId) => { 
            placements[coordId] = this.state.selectedTile.map(st => st); 
          });
          setNewState(placements, startId);
          ids.forEach((id) => {
            setNewState(placements, id);
          });
          this.setState({ placements });
        })
      });

    }
    loadFile() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const jsonData = JSON.parse(fileContent);
          const { images, tiles, placements, size, orientation, pages, printOrientation } = jsonData;
          const stateData = { images, tiles, placements, size, orientation, pages, printOrientation: (printOrientation || 'portrait') };
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
    }
    downloadFile() {
      const { images, tiles, placements, size, orientation, pages, printOrientation } = this.state;
      this.modals.fileDownload.open({
        defaultFilename:"cobblestone",
        jsonData:{ images, tiles, placements, size, orientation, pages, printOrientation }
      });
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
        (files) => {
          const { images, tiles } = files.reduce(({images, tiles}, {filename, dataURL}) => {
            images[filename] = dataURL;
            tiles[filename] = { '': true };
            return {images, tiles};
          }, {
            images: util.merge(this.state.images),
            tiles: util.merge(this.state.tiles)
          });
          this.setState({ images, tiles });
        },
        (errors) => {
          console.log({ errors });
          alert('Failed to load files. See console for error.');
        }
      );
    }
    editTile(filename) {
      this.modals.tileEditor.open({ filename, dataURL: this.state.images[filename], tiles: this.state.tiles[filename] });
    }
    toggleTile(coordId) {
      if (this.state.selectedTile) {
        const placements = util.merge(this.state.placements);
        const tile = placements[coordId];
        if (tile) {
          delete placements[coordId];
        } else {
          placements[coordId] = this.state.selectedTile.map(st => st);
        }
        this.setState({placements});
      }
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    afterRender() {
      const elements = ['paletteScroll','canvasSVG','paletteAddButton'].reduce((outVal,id) => {
        outVal[id] = document.getElementById(id);
        return outVal;
      }, {});
      elements.paletteScroll.style.maxHeight = elements.canvasSVG.clientHeight - elements.paletteAddButton.clientHeight;
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
        <div className="row justify-content-center">
          <div className="col-5">
            <div className="rpg-box m-3">
              <div className="d-flex justify-content-around">
                <button title="Load File" className="btn btn-primary text-light" onClick={() => { this.loadFile() }}><i className="far fa-folder-open"></i></button>
                <button title="Download Datafile" className="btn btn-primary text-light" onClick={() => { this.downloadFile() }}><i className="far fa-floppy-disk"></i></button>
                <button title="Download Image" className="btn btn-primary text-light" onClick={() => { this.modals.imageDownload.open(this.state) }}><i className="far fa-file-image"></i></button>
                <button title="Publish Printable" className="btn btn-primary text-light" onClick={() => { 
                  console.log({ publishState: this.state });
                  this.modals.publish.open(this.state);
                }}><i className="fas fa-print"></i></button>
                <button title="About" className="btn btn-primary text-light" onClick={() => { Dialog.alert({ title: "About Spritely ...", lines: about }) }}><i className="far fa-circle-question"></i></button>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="rpg-box m-3">
              <div className="d-flex justify-content-around">
                <button title="Shift Left" className="btn btn-primary text-light" onClick={() => { this.transform("shiftLeft") }}><i className={`fas fa-arrow-left`}></i></button>
                <button title="Shift Right" className="btn btn-primary text-light" onClick={() => { this.transform("shiftRight") }}><i className={`fas fa-arrow-right`}></i></button>
                <button title="Shift Up" className="btn btn-primary text-light" onClick={() => { this.transform("shiftUp") }}><i className={`fas fa-arrow-up`}></i></button>
                <button title="Shift Down" className="btn btn-primary text-light" onClick={() => { this.transform("shiftDown") }}><i className={`fas fa-arrow-down`}></i></button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-4 h-100" >
            <div className="rpg-title-box m-3 d-flex flex-column" title="Palette">
              <div id="paletteAddButton" className="d-flex justify-content-center mb-1">
                <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
              </div>
              <div className="w-100 d-flex flex-wrap justify-content-center tile-buttons" id="paletteScroll">
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
          </div>
          <div className="col-7 h-100">
            <div className="rpg-title-box m-3" title="click to place a tile" >
              <svg id="canvasSVG" key="svg-canvas" width="100%" height="75%" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${fullWidth} ${fullHeight}`}>
              {
                util.range(width).map((x) => {
                  return util.range(height).map((y) => {
                    const coordId = gUtil.getCoordinateId(x, y);
                    const tile = this.state.placements[coordId];
                    const tileId = tile ? cUtil.getTileId(tile[0], tile[1]) : emptyCellId;
                    return <a href="#" onClick={(e) => {
                      e.preventDefault();
                      this.toggleTile(coordId);
                    }}>
                      <use id={coordId} x={tileDim * x} y={tileDim * y} href={`#${tileId}`} stroke="black" strokeWidth="2" draggable="true" droptarget="true"/>
                    </a>;
                  });
                })
              }
                <g id={highlighterFrameId} x="0" y="0" width={fullWidth} height={fullHeight}></g>
              </svg>
            </div>
          </div>
        </div>
      </>;
    }
  }
});