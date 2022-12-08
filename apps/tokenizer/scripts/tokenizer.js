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
    'sp.tokenizer.TokenFrame': 'TokenFrame',
  },
  ({Dialog, FileDownload, Header, LoadFile, About, PrintTokens, Token, TokenFrame}) => {
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
            onClose: ({index,token}) => {
              const tokens = Array.from(this.state.tokens);
              tokens[index] = token;
              console.log({index,token});
              this.setState({ tokens });
              console.log(this.state);
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
                  this.modals.fileDownload.open();
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
            this.setState(jsonData);
          },
          (filename, error) => {
            console.log({filename, error});
            alert(filename + ' failed to load. See console for error.');
          }
        );
      }
      removeZeroCount() {
        this.setState({tokens: this.state.tokens.filter((t) => t.count > 0)});
      }
      loadImage() {
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            this.setState({
              tokens: [].concat(this.state.tokens, [Token.buildInitState(dataURL,filename,1)]),
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
        tokens[index].count = newCount;
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
              {this.state.tokens.map((token, index) => {
                return (
                  <div className="token rpg-box d-flex flex-column">
                    <span className="align-self-center">{token.filename}</span>
                    <div className="thumbnail-frame">
                      <Token token={token} index={index}/>
                    </div>
                    <input
                      className="form-control align-self-center"
                      style={{ width: '5em' }}
                      type="number"
                      min="0"
                      value={token.count}
                      onChange={(e) => {
                        updateCount(e.target.value, index);
                      }}
                    />
                    <button
                      className="btn btn-info"
                      onClick={ () => { this.modals.tokenFrame.open({ index, token }) } }
                    >Apply Frame</button>
                    <a
                      className="btn btn-success"
                      href={ token.url }
                      download={`token-${ token.filename }`}
                    >Download Token</a>
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
