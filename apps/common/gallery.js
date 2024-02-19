namespace('sp.common.Gallery',{
  'sp.common.Dialog':'Dialog',
  'sp.common.Header':'Header',
},({ Dialog, Header }) => {
  return function({ schematic: { sourceApp, downloadExtension, imageExtension, style, groups, items } }) {
    const menuItems = [{
      id: 'about',
      label: 'About',
      callback: () => {
        Dialog.alert({
          label: `${sourceApp} Gallery`,
          lines: [`Click on any of the images in the gallery to download the datafile used to reproduce that image in ${sourceApp}.`]
        });
      }
    }];
    const buildThumbnail = function(fileName,label) {
      return (<div className="d-flex flex-column justify-content-center">
        <a className="m-2" href={`./gallery/${fileName}${downloadExtension}`} download={true} title={label}>
          <img src={`./gallery/${fileName}${imageExtension}`} style={style} alt={label}/>
        </a>
        <h4 className="text-center">{ label }</h4>
      </div>);
    };
    return <>
      <Header menuItems={menuItems} appTitle={<><a href="./index.html">{ sourceApp }</a> Gallery</>}/>
      <div class="rpg-box m-3 d-flex flex-column justify-content-center">
        {groups.map((group, index) => {
          return <>
            <h4 className="text-center">{ group }</h4>
            <div className="d-flex flex-wrap justify-content-center">
              {items[group].map(({filename, label}) => buildThumbnail(filename, label))}
            </div>
            { (index < groups.length - 1) && <hr/> }
          </>
        })}
      </div>
    </>;
  }
});