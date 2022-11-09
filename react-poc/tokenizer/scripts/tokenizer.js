namespace('Tokenizer', ['Header'], ({ Header }) => {
  const [state, setState] = React.useState({ size: 1, tokens: [] });
  const loadImage = function () {
    const { size } = state;
    LoadFile(
      true,
      'dataURL',
      (dataURL, filename) => {
        setState({
          size,
          tokens: [].concat(state.tokens, [{ filename, dataURL, count: 1 }]),
        });
      },
      (filename, error) => {
        console.log({ filename, error });
        alert(filename + ' failed to load. See console for error.');
      }
    );
  };
  return function (props) {
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
      </>
    );
  };
});
