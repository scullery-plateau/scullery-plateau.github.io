namespace(
  'sp.tokenizer.Tokenizer',
  {
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.EditMode': 'EditMode',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.common.Utilities':'util',
    'sp.tokenizer.PrintTokens': 'PrintTokens',
    'sp.tokenizer.TokenCanvas': 'TokenCanvas',
    'sp.tokenizer.TokenFrame': 'TokenFrame',
  },
  ({ buildAbout, Dialog, EditMode, FileDownload, Header, LoadFile, util, PrintTokens, TokenCanvas, TokenFrame}) => {
    const about = [
      'Tokenizer is a tool for reframing digital images into printable and downloadable tokens.',
      'Import your images, apply a frame, and download them or print them as tokens of 1", 2", 3", or 4".',
      'Publish sheets of currency, potions, scrolls, and conditions by increasing the count of a an image.',
    ];
    const validateLoadFileJson = function (data) {};
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.canvasId = props.canvasId;
        this.state = {size: 1, tokens: []};
        this.modals = Dialog.factory({
          about: {
            componentClass: buildAbout("Tokenizer",about),
            attrs: {class: 'rpg-box text-light w-75'},
            onClose: () => { },
          },
          fileDownload: {
            componentClass: FileDownload,
            attrs: {class: 'rpg-box text-light w-75'},
            onClose: () => { },
          },
          tokenFrame: {
            componentClass: TokenFrame,
            attrs: {class: 'rpg-box text-light w-75'},
            onClose: ({index,token,baseImg}) => {
              const tokens = Array.from(this.state.tokens);
              tokens[index] = {token,baseImg};
              this.setState({ tokens });
            },
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
                  const {size, tokens} = this.state;
                  this.modals.fileDownload.open({
                    fieldId:"tokenizerDataFileName",
                    placeholder:"tokenizer",
                    defaultFilename:"tokenizer",
                    jsonData:{ size, tokens:tokens.map((t) => t.token) }
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
              this.setState({size});
            },
            options: [1, 2, 3, 4].map((v) => {
              return {label: `${v} inch`, value: v};
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
            const { size, tokens } = jsonData;
            const allTokens = tokens.map((token) => {
              const t = { token };
              util.initImageObj(token.url,(baseImg) => {
                token.canvasURL = TokenCanvas.drawCanvasURL(this.canvasId,baseImg,token);
                t.baseImg = baseImg;
              });
              return t;
            });
            const retry = (() => {
              const imgCount = allTokens.filter(t => t.baseImg).length;
              const tokenCount = allTokens.length;
              if (imgCount === tokenCount) {
                setTimeout(retry,500);
              } else {
                this.setState({size,tokens:allTokens});
              }
            });
            retry();
          },
          (filename, error) => {
            console.log({filename, error});
            alert(filename + ' failed to load. See console for error.');
          }
        );
      }
      removeZeroCount() {
        this.setState({tokens: this.state.tokens.filter((t) => t.token.copyCount > 0)});
      }
      loadImage() {
        const filesToTokens = ((files, tokens) => {
          console.log({ files, tokens });
          if (files.length == 0) {
            this.setState({ tokens });
          } else {
            const { filename, dataURL } = files[0];
            const token = TokenCanvas.initState(dataURL,filename,1);
            util.initImageObj(dataURL,(baseImg) => {
              token.canvasURL = TokenCanvas.drawCanvasURL(this.canvasId, baseImg, token);
              filesToTokens(files.slice(1), [].concat(tokens, [{token, baseImg}]));
            });
          }
        });
        LoadFile(
          true,
          'dataURL',
          (files) => {
            console.log({ files });
            filesToTokens(files,this.state.tokens);
          },
          (errors) => {
            console.log({ errors });
            alert('Failed to load files. See console for error.');
          }
        );
      }
      updateCount(newCount, index) {
        const tokens = Array.from(this.state.tokens);
        tokens[index].token.copyCount = parseInt(newCount);
        this.setState({ tokens });
      }
      render() {
        return (
          <>
            <Header menuItems={ this.menuItems } appTitle={'Tokenizer'}/>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={() => {
                  this.loadImage();
                }}
              >
                Add Image To Tokenizer
              </button>
            </div>
            { this.state.tokens.length > 0 &&
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    PrintTokens.printTokenPages('Print Tokenizer',this.state.size,this.state.tokens);
                  }}>
                  Publish Printable
                </button>
              </div>
            }
            <div className="gallery m-3 d-flex flex-wrap justify-content-around">
              {this.state.tokens.map(({token,baseImg}, index) => {
                return (
                  <div className="token rpg-box d-flex flex-column">
                    <span className="align-self-center">{token.filename}</span>
                    <div className="thumbnail-frame d-flex justify-content-center">
                      { token.canvasURL && <a
                        href={ token.canvasURL }
                        download={`token-${ token.filename }`}
                      ><img style={{ width:"6em", height:"6em"}} src={token.canvasURL}/></a>}
                    </div>
                    <input
                      className="form-control align-self-center"
                      style={{ width: '5em' }}
                      type="number"
                      min="0"
                      value={token.copyCount}
                      onChange={(e) => {
                        this.updateCount(e.target.value, index);
                      }}
                    />
                    <button
                      className="btn btn-info"
                      onClick={ () => { this.modals.tokenFrame.open({ canvasId: this.canvasId, index, token, baseImg }) } }
                    >Apply Frame</button>
                  </div>
                );
              })}
            </div>
          </>
        );
      };
    }
  }
);
