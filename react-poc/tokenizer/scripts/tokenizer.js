namespace(
  'Tokenizer',
  ['Dialog', 'Header', 'TokenFrame'],
  ({ Dialog, Header, TokenFrame }) => {
    return function (props) {
      const [state, setState] = React.useState({ size: 1, tokens: [] });
      const loadImage = function () {
        const { size } = state;
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            setState({
              size,
              tokens: [].concat(state.tokens, [
                { filename, dataURL, thumbnail: dataURL, count: 1 },
              ]),
            });
          },
          (filename, error) => {
            console.log({ filename, error });
            alert(filename + ' failed to load. See console for error.');
          }
        );
      };
      return (
        <>
          <Header menuItems={[]} appTitle={'Tokenizer'} />
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
                  <div
                    className="frame align-self-center"
                    style={{ backgroundImage: `url(${token.thumbnail})` }}
                  ></div>
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
                </div>
              );
            })}
          </div>
        </>
      );
    };
  }
);
