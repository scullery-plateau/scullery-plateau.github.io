namespace('sp.minifier.Minifier',{
  'sp.common.Dialog': 'Dialog',
  'sp.common.EditMode': 'EditMode',
  'sp.common.FileDownload': 'FileDownload',
  'sp.common.Header': 'Header',
  'sp.common.LoadFile': 'LoadFile',
  'sp.common.Utilities':'util',
  'sp.minifier.MiniCanvas': 'MiniCanvas',
  'sp.minifier.PrintMinis': 'PrintMinis',
}, ({ Dialog, EditMode, FileDownload, Header, LoadFile, util, MiniCanvas, PrintMinis }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [
    'Minifier is a tool for turning digital images into printable standing miniatures.',
    'Import your images and print them as miniatures of 1", 2", 3", or 4".',
    'Publish sheets of armies, soldiers, or minions by increasing the count of a an image.',
  ];
  const validateLoadFileJson = function (data) {};
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.canvasId = props.canvasId;
      this.state = { size: 1, minis: [], synchronize: false };
      this.modals = Dialog.factory({
        fileDownload: {
          componentClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
      });
      this.menuItems = [
        {
          id: 'fileMenu',
          label: 'File',
          items: [
            {
              id: 'loadFile',
              label: 'Load File',
              callback: () => {
                this.loadFile();
              },
            },
            {
              id: 'download',
              label: 'Download File',
              callback: () => {
                const { size, minis } = this.state;
                this.modals.fileDownload.open({
                  fieldId:"minifierDataFileName",
                  placeholder:"minifier",
                  defaultFilename:"minifier",
                  jsonData:{ size, minis }
                });
              },
            },
          ],
        },
        {
          id: 'removeZeroCount',
          label: 'Remove Zero Count',
          callback: () => {
            this.removeZeroCount();
          },
        },
        {
          id: 'sizePicker',
          label: 'Size',
          groupClassName: 'size-picker',
          getter: () => this.state.size,
          setter: (size) => {
            this.setState({ size, minis: Array.from(this.state.minis).map(({ mini, baseImg }) => {
              mini.canvasURL = MiniCanvas.drawCanvasURL(baseImg, mini, PrintMinis.getFrame(size));
              return { mini, baseImg };
            }) });
          },
          options: [1, 2, 3, 4].map((v) => {
            return { label: `${v} inch`, value: v };
          }),
        },
        {
          id: 'about',
          label: 'About',
          callback: () => {
            Dialog.alert({ label: "Minifier", lines: about });
          },
        },
      ];
      EditMode.enable();
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
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    removeZeroCount() {
      this.setState({ minis: this.state.minis.filter(({mini}) => mini.count > 0) });
    }
    loadImage() {
      const filesToMinis = ((files, minis) => {
        if (files.length == 0) {
          this.setState({ minis });
        } else {
          const { filename, dataURL } = files[0];
          const mini = MiniCanvas.initState(dataURL, filename, 1);
          util.initImageObj(dataURL, (baseImg) => {
            mini.canvasURL = MiniCanvas.drawCanvasURL(this.canvasId, baseImg, mini, PrintMinis.getRatio(this.state.size));
            filesToMinis(files.slice(1), [].concat(minis, [{mini, baseImg}]));
          });
        }
      });
      LoadFile(
        true,
        'dataURL',
        (files) => {
          filesToMinis(files, this.state.minis);
        },
        (errors) => {
          console.log({ errors });
          alert('Failed to load files. See console for error.');
        }
    );
    }
    synchronizeScale(synchronizedScale) {
      this.setState({ 
        minis: Array.from(this.state.minis).map(({ mini, baseImg }) => {
          mini.scale = synchronizedScale;
          mini.canvasURL = MiniCanvas.drawCanvasURL(this.canvasId, baseImg, mini, PrintMinis.getRatio(this.state.size));
          return { mini, baseImg };
        })
      });
    }
    buildField(mini, baseImg, label, field, predicate) {
      predicate = predicate || ((value) => value);
      return <>
        <dt>{ label }</dt>
        <dd>{(predicate(!this.state.editForm))?(<>
          <span>{ mini[field] }</span>
        </>):(<>
          <input 
            type="number" 
            value={ this.state.editForm[field] }
            onClick={(e) => {
              const editForm = util.copy(this.state.editForm);
              editForm[field] = parseInt(e.target.value);
              editForm.canvasURL = MiniCanvas.drawCanvasURL(this.canvasId, baseImg, util.merge(mini, editForm), PrintMinis.getRatio(this.state.size));
              this.setState({ editForm });
            }}/>
        </>)}</dd>
      </>;
    }
    render() {
      return (
        <>
          <Header menuItems={this.menuItems} appTitle={'Minifier'} />
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={() => {
                this.loadImage();
              }}>
              Add Image To Minify
            </button>
          </div>
          { this.state.minis.length > 0 &&
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={() => {
                  PrintMinis.printMiniPages('Print Minifier',this.state.size,this.state.minis);
                }}>
                Publish Printable
              </button>
              { !this.state.editForm && 
                  <button className="btn btn-primary" onClick={() => {
                    this.setState({ expandAll: !this.state.expandAll })
                  }}>
                  { this.expandAll?"Collapse All":"Expand All" }
                </button>
              }
              <button
                className={"btn btn-" + this.state.synchronize?"secondary":"primary"}
                onClick={() => {
                    this.setState({ synchronize: !this.state.synchronize });
                  }}>
                Synchronize Size
              </button>
              {
                this.state.synchronize && 
                <input
                  className="form-control align-self-center"
                  style={{ width: '5em' }}
                  type="number"
                  min="0"
                  value={this.state.synchronizedScale}
                  onChange={(e) => {
                    this.synchronizeScale(parseFloat(e.target.value));
                  }}
                />
              }
            </div>
          }
          <div className="gallery m-3 d-flex flex-wrap justify-content-around">
            { this.state.minis.map(({mini, baseImg}, index) => {
              return <div className="rpg-box d-flex">
                <div className="thumbnail d-flex flex-column">
                  <span className="align-self-center">{mini.filename}</span>
                  <div className="frame align-self-center"
                      style={{ backgroundImage: `url(${this.state.editForm?this.state.editForm:mini.canvasURL})` }}>
                  </div>
                  { 
                    !this.state.expandAll && (this.state.specIndex != index) &&
                    <button 
                      className={"btn btn-" + this.state.synchronize?"secondary":"primary"}
                      onClick={() => {
                        this.setState({ specIndex: index });
                      }}>Specs</button>
                  }
                </div>
                  { 
                    (this.specIndex == index || this.state.expandAll) &&
                    <div className="d-flex flex-column">
                      <dl>
                        { this.buildField(mini, baseImg, "Count", "count") }
                        { this.buildField(mini, baseImg, "Scale (pixels/inch)", "scale", (value) => value || this.state.synchronize) }
                        { this.buildField(mini, baseImg, "X-Offset", "xOffset") }
                        { this.buildField(mini, baseImg, "Y-Offset", "yOffset") }
                      </dl>
                      <>
                        { !this.state.editForm?(<>
                            <div className="d-flex">
                              <button 
                                className="btn btn-primary"
                                onClick={() => {
                                  this.setState({ specIndex: index, editForm: util.selectKeys(mini, ["canvasURL","count", "scale", "xOffset", "yOffset"])});
                                }}>Edit</button>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => {
                                  this.setState({ specIndex: -1 });
                                }}>Collapse</button>
                            </div>
                          </>):(<>
                            { this.specIndex == index &&
                              <div className="d-flex">
                                <button 
                                  className="btn btn-success"
                                  onClick={() => {
                                    const minis = Array.from(this.state.minis);
                                    minis[index][0] = util.merge(mini,this.state.editForm);
                                    this.setState({ minis, editForm: undefined });
                                  }}>Confirm</button>
                                <button 
                                  className="btn btn-danger"
                                  onClick={() => {
                                    this.setState({ editForm: undefined });
                                  }}>Cancel</button>
                              </div>
                            }
                          </>) 
                        }
                      </>
                    </div>
                  }
              </div>;
            })}
          </div>
        </>
      );
    }
  }
});