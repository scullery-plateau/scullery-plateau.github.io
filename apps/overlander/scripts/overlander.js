namespace('sp.overlander.Overlander',{
    'sp.common.BuildAbout':'buildAbout',
    'sp.common.ColorPicker':'ColorPicker',
    'sp.common.Dialog':'Dialog',
    'sp.common.FileDownload':'FileDownload',
    'sp.common.Header':'Header',
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Utilities':'util',
},({ buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, util }) => {
    const about = [];
    const validateLoadFileJson = function() {};
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                about: {
                  templateClass: buildAbout("Overlander",about),
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: () => {}
                },
                fileDownload: {
                  templateClass: FileDownload,
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: () => {}
                },
                colorPicker: {
                  templateClass: ColorPicker,
                  attrs: { class: 'rpg-box text-light w-75' },
                  onClose: ({ color, index }) => {
                    this.setColorFromPicker(index, color);
                  },
                },
            });
            this.menuItems = [];
        }
        render() {
            return <>
                <Header menuItems={this.menuItems} appTitle={'Overlander'} />
                <div className="d-flex justify-content-center rpg-box text-light m-1 ">
                  <svg className="w-75" width="100%" height="100%" viewBox="0 0 800 1000">
                    <rect width="800" height="1000" fill="white" stroke="black" strokeWidth="4"/>
                    
                  </svg>
                </div>
            </>;
        }
    }
});