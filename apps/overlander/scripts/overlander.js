namespace('sp.overlander.Overlander',{
    'sp.common.BuildAbout':'buildAbout',
    'sp.common.ColorPicker':'ColorPicker',
    'sp.common.Dialog':'Dialog',
    'sp.common.FileDownload':'FileDownload',
    'sp.common.Header':'Header',
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Utilities':'util',
},({ buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, util, ImageDownload, MondrianSVG }) => {
    const about = [];
    const validateLoadFileJson = function() {};
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                about: {
                  templateClass: buildAbout("Mondrian",about),
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
        }
        render() {
            return <>
                <Header menuItems={this.menuItems} appTitle={'Mondrian'} />
            </>;
        }
    }
});