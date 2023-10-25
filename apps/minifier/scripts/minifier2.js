namespace(
  'sp.minifier.Minifier2',
  {
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.EditMode': 'EditMode',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.minifier.PrintMinis': 'PrintMinis',
  },
  ({ buildAbout, Dialog, EditMode, FileDownload, Header, LoadFile, PrintMinis }) => {
    const about = [
      'Minifier is a tool for turning digital images into printable standing miniatures.',
      'Import your images and print them as miniatures of 1", 2", 3", or 4".',
      'Publish sheets of armies, soldiers, or minions by increasing the count of a an image.',
    ];
    const validateLoadFileJson = function (data) {};
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = { size: 1, minis: [] };
        this.modals = Dialog.factory({
          about: {
            templateClass: buildAbout("Minifier",about),
            attrs: { class: 'rpg-box text-light w-75' },
            onClose: () => {},
          },
          fileDownload: {
            templateClass: FileDownload,
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
              const { minis } = state;
              this.setState({ size, minis });
            },
            options: [1, 2, 3, 4].map((v) => {
              return { label: `${v} inch`, value: v };
            }),
          },
          {
            id: 'about',
            label: 'About',
            callback: () => {
              this.modals.about.open();
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
        const { size, minis } = this.state;
        this.setState({ size, minis: minis.filter((t) => t.count > 0) });
      }
      loadImage() {
        const { size } = this.state;
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            this.setState({
              size,
              minis: [].concat(this.state.minis, [{ filename, dataURL, count: 1 }]),
            });
          },
          (filename, error) => {
            console.log({ filename, error });
            alert(filename + ' failed to load. See console for error.');
          }
        );
      }
      updateCount(newCount, index) {
        const { size } = this.state;
        const minis = Array.from(this.state.minis);
        minis[index].count = newCount;
        this.setState({ size, minis });
      };
      synchronizeScale(synchronizedScale) {
        
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
                <button className="btn btn-primary" onClick={() => {
                      this.setState({ expandAll: !this.state.expandAll })
                    }}>
                  { this.expandAll?"Collapse All":"Expand All" }
                </button>
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
              { this.state.minis.map((thumb, index) => {
                <div className="thumbnail rpg-box d-flex flex-column">
                  <span className="align-self-center">{thumb.filename}</span>
                  <div className="frame align-self-center"
                       style={{ backgroundImage: `url(${thumb.dataURL})` }}>
                  </div>
                  { 
                    !this.state.expandAll && this.state.specIndex != index &&
                    <button
                    className={"btn btn-" + this.state.synchronize?"secondary":"primary"}
                    onClick={() => {
                        this.setState({ specIndex: index });
                      }}>
                    specs
                  </button>
                  }
                </div>
                { 
                  /* TODO - specs / form layout */ 
                }
              })}
            </div>
          </>
        );
      }
    }
  }
);