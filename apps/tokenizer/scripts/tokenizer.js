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
    return function () {
      const validateLoadFileJson = function (data) {};
      const [state, setState] = React.useState({size: 1, tokens: []});
      const modals = Dialog.factory({
        about: {
          templateClass: About,
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: () => {
          },
        },
        fileDownload: {
          templateClass: FileDownload,
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: () => {
          },
        },
        tokenFrame: {
          templateClass: TokenFrame,
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: ({index,token}) => {
            const { size } = state;
            const tokens = Array.from(state.tokens);
            tokens[index] = token;
            setState({ size, tokens });
          },
        },
      });
      const loadFile = function () {
        LoadFile(
          false,
          'text',
          (fileContent) => {
            const jsonData = JSON.parse(fileContent);
            const error = validateLoadFileJson(jsonData);
            if (error) {
              throw error;
            }
            setState(jsonData);
          },
          (filename, error) => {
            console.log({filename, error});
            alert(filename + ' failed to load. See console for error.');
          }
        );
      };
      const removeZeroCount = function () {
        const {size} = state;
        setState({size, tokens: state.tokens.filter((t) => t.count > 0)});
      };
      const loadImage = function () {
        const {size} = state;
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            setState({
              size,
              tokens: [].concat(state.tokens, [Token.buildInitState(dataURL,filename,1)]),
            });
          },
          (filename, error) => {
            console.log({filename, error});
            alert(filename + ' failed to load. See console for error.');
          }
        );
      };
      const updateCount = function (newCount, index) {
        const {size} = state;
        const tokens = Array.from(state.tokens);
        tokens[index].count = newCount;
        setState({size, tokens});
      };
      const menuItems = [
        {
          id: 'fileMenu',
          label: 'File',
          items: [
            {
              id: 'loadFile',
              label: 'Load File',
              callback: () => {
                loadFile();
              },
            },
            {
              id: 'download',
              label: 'Download File',
              callback: () => {
                modals.fileDownload.open();
              },
            },
            {
              id: 'publish',
              label: 'Publish Printable',
              callback: () => {
                PrintTokens.printTokenPages(
                  'Print Tokenizer',
                  state.size,
                  state.tokens
                );
              },
            },
          ],
        },
        {
          id: 'removeZeroCount',
          label: 'Remove Zero Count',
          callback: () => {
            removeZeroCount();
          },
        },
        {
          id: 'sizePicker',
          label: 'Size',
          getter: () => state.size,
          setter: (size) => {
            const {tokens} = state;
            setState({size, tokens});
          },
          options: [1, 2, 3, 4].map((v) => {
            return {label: `${v} inch`, value: v};
          }),
        },
        {
          id: 'about',
          label: 'About',
          callback: () => {
            modals.about.open();
          },
        },
      ];
      return (
        <>
          <Header menuItems={ menuItems } appTitle={'Tokenizer'}/>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={() => {
                loadImage();
              }}
            >
              Add Image To Tokenizer
            </button>
          </div>
          <div className="gallery m-3 d-flex flex-wrap justify-content-around">
            {state.tokens.map((token, index) => {
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
                    onClick={ () => { modals.tokenFrame.open({ index, token }) } }
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
);
