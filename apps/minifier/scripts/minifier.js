namespace(
  'sp.minifier.Minifier',
  {
    'sp.common.Dialog': 'Dialog',
    'sp.common.FileDownload': 'FileDownload',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.minifier.About': 'About',
    'sp.minifier.PrintMinis': 'PrintMinis',
  },
  ({ About, Dialog, FileDownload, Header, LoadFile, PrintMinis }) => {
    const validateLoadFileJson = function (data) {};
    return function () {
      const modals = Dialog.factory({
        about: {
          templateClass: About,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
        fileDownload: {
          templateClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
      });
      const [state, setState] = React.useState({ size: 1, minis: [] });
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
            console.log({ filename, error });
            alert(filename + ' failed to load. See console for error.');
          }
        );
      };
      const removeZeroCount = function () {
        const { size } = state;
        setState({ size, minis: state.minis.filter((t) => t.count > 0) });
      };
      const loadImage = function () {
        const { size } = state;
        LoadFile(
          true,
          'dataURL',
          (dataURL, filename) => {
            setState({
              size,
              minis: [].concat(state.minis, [{ filename, dataURL, count: 1 }]),
            });
          },
          (filename, error) => {
            console.log({ filename, error });
            alert(filename + ' failed to load. See console for error.');
          }
        );
      };
      const updateCount = function (newCount, index) {
        const { size } = state;
        const minis = Array.from(state.minis);
        minis[index].count = newCount;
        setState({ size, minis });
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
                PrintMinis.printMiniPages(
                  'Print Minifier',
                  state.size,
                  state.minis
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
          groupClassName: 'size-picker',
          getter: () => state.size,
          setter: (size) => {
            const { minis } = state;
            setState({ size, minis });
          },
          options: [1, 2, 3, 4].map((v) => {
            return { label: `${v} inch`, value: v };
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
          <Header menuItems={menuItems} appTitle={'Minifier'} />
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={() => {
                loadImage();
              }}
            >
              Add Image To Minify
            </button>
          </div>
          <div className="gallery m-3 d-flex flex-wrap justify-content-around">
            { state.minis.map((thumb, index) => {
              return (
                <div className="thumbnail rpg-box d-flex flex-column">
                  <span className="align-self-center">{thumb.filename}</span>
                  <div
                    className="frame align-self-center"
                    style={{ backgroundImage: `url(${thumb.dataURL})` }}
                  ></div>
                  <input
                    className="form-control align-self-center"
                    style={{ width: '5em' }}
                    type="number"
                    min="0"
                    value={thumb.count}
                    onChange={(e) => {
                      updateCount(parseInt(e.target.value), index);
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
