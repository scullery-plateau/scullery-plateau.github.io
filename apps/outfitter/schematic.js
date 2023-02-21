namespace('sp.outfitter.GallerySchematic',{},() => {
    const makeLabel = function(filename) {
        return filename.split("-").map(word => {
            return word.slice(0,1).toUpperCase() + word.slice(1);
        }).join(" ");
    };
    const items = [
        ['Critical Role: Mighty Nein', 'bluud'],
        ['Critical Role: Vox Machina', 'grog'],
        ['Miscellaneous','he-man'],
        ['Miscellaneous','link'],
        ['Critical Role: Vox Machina', 'percy'],
        ['Critical Role: Vox Machina', 'pike'],
        ['Critical Role: Mighty Nein', 'ruby', 'Marion Lavore'],
        ['Miscellaneous','skeleton'],
        ['Miscellaneous','skeletor'],
        ['Critical Role: Vox Machina', 'tiberius'],
        ['Critical Role: Vox Machina', 'vex']
    ].map(([group,filename,label]) => {
            label = label || makeLabel(filename);
            return { group, filename, label};
        }).reduce((out,obj) => {
            if(!out[obj.group]) {
                out[obj.group] = [];
            }
            out[obj.group].push(obj);
            return out;
        }, {});
    return {
        sourceApp: "Outfitter",
        downloadExtension: ".json",
        imageExtension: ".png",
        style:{ 
            height: '150px'
        },
        groups:[ 'Miscellaneous', 'Critical Role: Vox Machina', 'Critical Role: Mighty Nein' ],
        items
    };
});