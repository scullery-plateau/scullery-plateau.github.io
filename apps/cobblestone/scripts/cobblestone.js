namespace('sp.cobblestone.Cobblestone',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog': 'Dialog',
    'sp.common.Header': 'Header',
    'sp.common.LoadFile': 'LoadFile',
},({ buildAbout, Dialog, Header, LoadFile }) => {
    const about = [
        'Cobblestone is a canvas for game boards and battle maps.',
    ];
    const sizes = [
      "25 x 25"
    ];
    const validateLoadFileJson = function() {};
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                about: {
                    templateClass: buildAbout("Cobblestone",about),
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                }
            })
            this.menuItems = [{
                id: 'fileMenu',
                label: 'File',
                items: [{
                    id: 'loadFile',
                    label: 'Load File',
                    callback: () => {
                        this.loadFile();
                    },
                },{
                    id: 'downloadFile',
                    label: 'Download File',
                    callback: () => {
                    },
                },{
                    id: 'downloadImage',
                    label: 'Download Image',
                    callback: () => {
                    },
                },{
                    id: 'publishPrintable',
                    label: 'Publish Printable',
                    callback: () => {
                    },
                }]
            },{
                id: 'sizeMenu',
                label: 'Size',
                groupClassName: 'size-picker',
                getter: () => this.state.size,
                setter: (size) => {
                    this.setState({ size });
                },
                options: sizes.map((value) => {
                    return { label: value, value };
                }),
            },{
              id: 'orientationMenu',
              label: 'Orientation',
              groupClassName: 'size-picker',
              getter: () => this.state.orientation,
              setter: (orientation) => {
                this.setState({ orientation });
              },
              options: ['Portrait','Landscape'].map((value) => {
                return { label: value, value: value.toLowerCase() };
              }),
            },{
                id: 'about',
                label: 'About',
                callback: () => {
                    this.modals.about.open();
                },
            }];
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
              (fileName, error) => {
                  console.log({ fileName, error });
                  alert(fileName + ' failed to load. See console for error.');
              }
            );
        }
        addImage() {}
        render() {
            return <>
                <Header menuItems={this.menuItems} appTitle={'Cobblestone'} />
                <div className="rpg-title-box m-3 d-flex justify-content-between" title="Palette" >
                    <button className="btn btn-success" title="Add Image" onClick={() => this.addImage()}>+</button>
                    <div className="ml-2 w-100 d-flex flex-nowrap">
                        { /* tileSet */ }
                    </div>
                </div>
                <div className="rpg-title-box m-3" title="click to place a tile" >
                    { /* canvas */ }
                </div>
            </>;
        }
    }
});