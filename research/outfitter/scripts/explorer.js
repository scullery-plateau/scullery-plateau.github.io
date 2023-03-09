namespace('sp.outfitter.Explorer', {
  'sp.common.Ajax': 'Ajax',
  'sp.common.CSV': 'CSV',
  'sp.common.Dialog': 'Dialog',
  'sp.common.LoadFile': 'LoadFile',
  'sp.common.ProgressBar': 'ProgressBar',
  'sp.common.Utilities': 'util',
  'sp.outfitter.Composite': 'Composite',
  'sp.outfitter.LayerGrouper': 'LayerGrouper',
  'sp.outfitter.LayerSVG': 'LayerSVG',
}, ({Ajax, CSV, Dialog, LoadFile, ProgressBar, util, Composite, LayerGrouper, LayerSVG}) => {
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
  const validateLoadFileJson = function (data) {
  };
  const getDefaultSchematic = function (assetName) {
    return {
      assetName,
      ignored: {},
      partCount: {},
      grouped: {}
    }
  };
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.modals = Dialog.factory({
        groupLayers: {
          templateClass: LayerGrouper,
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: ({ selectedLayers, part }) => {

          }
        }
      });
    }

    loadMeta(assetName, schematic) {
      const init = {schematic, progress: 1, selected: {}};
      if (schematic.used) {
        init.used = schematic.used;
        delete schematic.used;
      }
      this.setState(init);
      Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/research/outfitter/assets/${assetName}.json`,
        {
          success: (responseText) => {
            const metadata = JSON.parse(responseText);
            const update = { metadata, progress: undefined, selected: {} }
            if (this.state.used){
              update.unused = Object.keys(metadata).map((k) => parseInt(k)).sort().filter((k) => {
                return this.state.used.indexOf(k.toString()) < 0;
              });
            }
            this.setState(update);
          },
          failure: (resp) => {
            console.log(resp);
            throw resp;
          },
          stateChange: (state) => {
            const progress = (100 * (state.state + 1)) / (state.max + 1);
            this.setState({ progress })
          }
        });
    }

    loadSchematic() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const schematicData = JSON.parse(fileContent);
          const error = validateLoadFileJson(schematicData);
          if (error) {
            throw error;
          }
          const schematic = util.merge(getDefaultSchematic(schematicData.assetName),schematicData);
          if (schematic.records || schematic.patterns) {
            const used = [];
            (schematic.patterns || []).forEach((i) => {
              used.push(i);
            });
            (schematic.records || []).forEach(({base,detail,outline}) => {
              if(base) used.push(base);
              if(detail) used.push(detail);
              if(outline) used.push(outline);
            });
            schematic.used = used;
          }
          this.loadMeta(schematic.assetName, schematic);
        },
        (fileName, error) => {
          console.log({fileName, error});
          alert(fileName + ' failed to load. See console for error.');
        });
    }

    loadDataTable() {
      LoadFile(
        false,
        'text',
        (fileContent, filename) => {
          const csvData = CSV.parse(fileContent);
          const names = assetNames.filter((name) => {
            return filename.indexOf(name) >= 0;
          })
          if (names.length != 1) {
            throw `asset name not in filename: ${filename}`;
          }
          const assetName = names[0];
          const schematic = getDefaultSchematic(assetName);
          const header = csvData[0];
          console.log({ header });
          schematic.dataTable = csvData.slice(1).map((record) => {
            return header.reduce((out,h,i) => {
              const value = record[i];
              if (value && value.length > 0) {
                out[h] = value;
              }
              return out;
            }, {});
          });
          const flagged = schematic.dataTable.filter((record) => {
            return record.flagged && record.flagged.length > 0;
          });
          console.log({ flagged });
          if (flagged.length > 0) {
            schematic.flagged = flagged;
          }
          this.loadMeta(schematic.assetName, schematic);
        },
        (fileName, error) => {
          console.log({fileName, error});
          alert(fileName + ' failed to load. See console for error.');
        });
    }

    loadNew(assetName) {
      this.loadMeta(assetName, getDefaultSchematic(assetName));
    }

    ignoreSelected() {
      const assetName = this.state.schematic.assetName;
      const partCount = util.merge(this.state.schematic.partCount);
      const grouped = Object.entries(this.state.schematic.grouped).reduce((out,[k,v]) => {
        out[k] = Array.from(v);
        return out;
      },{});
      const ignored = Object.entries(this.state.selected).reduce((out,[k, v]) => {
        out[k] = v;
        return out;
      },this.state.schematic.ignored);
      this.setState({ selected: {}, schematic: { assetName, ignored, partCount, grouped } });
    }

    groupSelected() {
      const { metadata, selected, schematic } = this.state;
      const { partCount } = schematic;
      this.modals.groupLayers.open({ metadata, selected, partCount });
    }

    selectLayer(imageIndex) {
      const selected = util.merge(this.state.selected);
      console.log({ selected })
      if (selected[imageIndex]) {
        delete selected[imageIndex];
      } else {
        selected[imageIndex] = true;
      }
      this.setState({ selected });
    }

    downloadSchematic() {
      util.triggerJSONDownload(this.state.schematic.assetName, this.state.schematic.assetName, this.state.schematic);
    }

    buildDataTable(records) {
      return <table>
        <tbody>
          { records.map((record) => {
            return <tr>
              { ['base','detail','outline'].map((layerName) => {
                const imageIndex = record[layerName];
                const layer = this.state.metadata[imageIndex];
                return <td>
                  { imageIndex && layer &&
                    <LayerSVG
                      layer={layer}
                      imageIndex={imageIndex}
                      isSelected={() => {}}
                      onClick={() => {}}/>
                  }
                </td>;
              }) }
              <td>
                <Composite
                  metadata={this.state.metadata}
                  record={record}
                  colors={{
                    base:'#0000ff',
                    detail:'#00ff00',
                    outline:'#ff0000'
                  }}/>
              </td>
            </tr>
          }) }
        </tbody>
      </table>;

    }

    render() {
      if (!this.state.schematic) {
        return <div className="d-flex flex-column justify-content-center">
          <div className="d-flex flex-wrap justify-content-center">
            <button className="btn btn-primary p-2 m-2" onClick={() => this.loadSchematic()}>Load Schematic</button>
            <button className="btn btn-primary p-2 m-2" onClick={() => this.loadDataTable()}>Load Data Table</button>
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            {assetNames.map((assetName) => {
              return <button className="btn btn-primary p-2 m-2" onClick={() => this.loadNew(assetName)}>Load Metadata
                '{assetName}'</button>
            })}
          </div>
        </div>;
      } else if (this.state.progress) {
        return <ProgressBar subject="metadata" progress={this.state.progress}/>
      } else if (!this.state.schematic.dataTable && !this.state.schematic.records && !this.state.schematic.patterns) {
        return <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary m-2" onClick={() => this.groupSelected()}>Group Selected</button>
            <button className="btn btn-warning m-2" onClick={() => this.ignoreSelected()}>Ignore Selected</button>
            <button className="btn btn-info m-2" onClick={() => this.downloadSchematic()}>Download Schematic</button>
          </div>
          <div className="d-flex justify-content-center flex-wrap overflow-scroll" style={{
            height: screen.availHeight * 0.75
          }}>
            { Object.keys(this.state.metadata).filter((imageIndex) => {
              console.log({ schematic: this.state.schematic });
              return !(imageIndex in this.state.schematic.ignored) && !(imageIndex in this.state.schematic.grouped);
            }).map((imageIndex) => {
              return <LayerSVG
                layer={this.state.metadata[imageIndex]}
                imageIndex={imageIndex}
                isSelected={() => this.state.selected[imageIndex]}
                onClick={() => this.selectLayer(imageIndex)}/>;
            }) }
          </div>
          <div className="d-flex justify-content-center flex-wrap">
            { /* todo - grouped */ }
          </div>
        </div>;
      } else if (this.state.schematic.dataTable && (!this.state.schematic.records && !this.state.schematic.patterns)) {
        return <div className="d-flex flex-column justify-content-center">
          <div>
            <button
              className="btn btn-success"
              onClick={() => {
                util.triggerJSONDownload(this.state.schematic.assetName,this.state.schematic.assetName, {
                  assetName: this.state.schematic.assetName,
                  records: this.state.schematic.dataTable
                });
              }}>Download Data Table JSON</button>
          </div>
          { this.state.schematic.flagged && <>
            { this.buildDataTable(this.state.schematic.flagged) }
            <hr/>
          </>}
          { this.buildDataTable(this.state.schematic.dataTable) }
        </div>;
      } else if (this.state.schematic.records || this.state.schematic.patterns) {
        return <div className="d-flex flex-column justify-content-center">
          { this.state.schematic.records && <>
            <h2>Composites</h2>
            <div className="d-flex flex-wrap justify-content-center">
              { this.state.schematic.records.map((record) => {
                return <Composite
                  metadata={this.state.metadata}
                  record={record}
                  colors={{
                    base:'#0000ff',
                    detail:'#00ff00',
                    outline:'#ff0000'
                  }}/>;
              }) }
            </div>
          </> }
          { this.state.schematic.patterns && <>
            <h2>Patterns</h2>
            <div className="d-flex flex-wrap justify-content-center">
              { this.state.schematic.patterns.map((imageIndex) => {
                const layer = this.state.metadata[imageIndex];
                return<LayerSVG
                  layer={layer}
                  imageIndex={imageIndex}
                  isSelected={() => {}}
                  onClick={() => {}}/>;
              }) }
            </div>
          </> }
          { this.state.unused && <>
            <h2>Unused</h2>
            <div className="d-flex flex-wrap justify-content-center">
              { this.state.unused.sort((a,b) => {
                return parseInt(a) - parseInt(b);
              }).map((imageIndex) => {
                const layer = this.state.metadata[imageIndex];
                return<LayerSVG
                  layer={layer}
                  imageIndex={imageIndex}
                  isSelected={() => {}}
                  onClick={() => {}}/>;
              }) }
            </div>
          </> }
        </div>;
      }
    }
  }
});