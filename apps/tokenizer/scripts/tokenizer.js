namespace(
  'sp.tokenizer.Tokenizer',
  {
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.tokenizer.About': 'About',
    'sp.tokenizer.PrintTokens': 'PrintTokens',
    'sp.tokenizer.Token': 'Token',
    'sp.tokenizer.TokenCanvas': 'TokenCanvas',
    'sp.tokenizer.TokenFrame': 'TokenFrame',
  },
  ({Dialog, FileDownload, Header, LoadFile, About, PrintTokens, Token, TokenCanvas, TokenFrame}) => {
    const validateLoadFileJson = function (data) {};
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {size: 1, tokens: []};
        this.modals = Dialog.factory({
          about: {
            templateClass: About,
            attrs: {class: 'rpg-box text-light w-75'},
            onClose: () => { },
          },
          fileDownload: {
            templateClass: FileDownload,
            attrs: {class: 'rpg-box text-light w-75'},
            onClose: () => { },
          },
          tokenFrame: {
            templateClass: TokenFrame,
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
              {
                id: 'publish',
                label: 'Publish Printable',
                callback: () => {
                  PrintTokens.printTokenPages(
                    'Print Tokenizer',
                    this.state.size,
                    this.state.tokens
                  );
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
            tokens.map((token) => {
              const t = { token };
              TokenCanvas.initImageObj(token.url,(baseImg) => {
                token.canvasURL = TokenCanvas.drawCanvasURL(baseImg,token);
                t.baseImg = baseImg;
              });
              return t;
            });
            const retry = () => {
              if (tokens.filter(t => !t.baseImg).length > 0) {
                setTimeout(retry,500);
              } else {
                this.setState({size,tokens});
              }
            }
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
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            const token = TokenCanvas.initState(dataURL,filename,1);
            TokenCanvas.initImageObj(dataURL,(baseImg) => {
              token.canvasURL = TokenCanvas.drawCanvasURL(baseImg,token);
              this.setState({ tokens: [].concat(this.state.tokens, [{token,baseImg}]) });
            });
          },
          (filename, error) => {
            console.log({filename, error});
            alert(filename + ' failed to load. See console for error.');
          }
        );
      }
      updateCount(newCount, index) {
        const tokens = Array.from(this.state.tokens);
        tokens[index].token.copyCount = newCount;
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
                      onClick={ () => { this.modals.tokenFrame.open({ index, token, baseImg }) } }
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
