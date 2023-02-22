namespace('sp.common.Gallery',{
    'sp.common.Header':'Header'
},({ Header }) => {
    return function({ schematic: { sourceApp, downloadExtension, imageExtension, style, groups, items } }) {
        const menuItems = [];
        const buildThumbnail = function(fileName,label) {
            return (<a className="m-2" href={`./gallery/${fileName}${downloadExtension}`} download={true} title={label}>
                <img src={`./gallery/${fileName}${imageExtension}`} style={style} alt={label}/>
            </a>);
        };
        return <>
            <Header menuItems={menuItems} appTitle={<a href="./index.html">sourceApp</a> + ' Gallery'} />
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