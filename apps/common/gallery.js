namespace('sp.common.Gallery',{
    'sp.common.BuildAbout':'buildAbout',
    'sp.common.Dialog':'Dialog',
    'sp.common.Header':'Header',
},({ buildAbout, Dialog, Header }) => {
    return function({ schematic: { sourceApp, downloadExtension, imageExtension, style, groups, items } }) {
        const modals = Dialog.factory({
            about: {
              componentClass: buildAbout(`${sourceApp} Gallery`,[`Click on any of the images in the gallery to download the datafile used to reproduce that image in ${sourceApp}.`]),
              attrs: { class: 'rpg-box text-light w-75' },
              onClose: () => {},
            }
        });
        const menuItems = [{
            id: 'about',
            label: 'About',
            callback: () => {
                modals.about.open();
            }
        }];
        const buildThumbnail = function(fileName,label) {
            return (<a className="m-2" href={`./gallery/${fileName}${downloadExtension}`} download={true} title={label}>
                <img src={`./gallery/${fileName}${imageExtension}`} style={style} alt={label}/>
            </a>);
        };
        return <>
            <Header menuItems={menuItems} appTitle={<><a href="./index.html">{ sourceApp }</a> Gallery</>}/>
            <div class="rpg-box m-3 d-flex flex-column justify-content-center">
                {groups.map(group => {
                    return <>
                        <h4 className="text-center">{ group }</h4>
                        <div class="d-flex flex-wrap justify-content-center">
                            {items[group].map(({filename, label}) => buildThumbnail(filename, label))}
                        </div>
                    </>
                })}
            </div>
        </>;
    }
});