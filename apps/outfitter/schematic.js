namespace('sp.outfitter.GallerySchematic',{},() => {
    const makeLabel = function(filename) {
        return filename.split("-").map(word => {
            return word.slice(0,1).toUpperCase() + word.slice(1);
        }).join(" ");
    };
    const items = [
        ['Critical Role: Vox Machina', 'arkhan'],
        ['Critical Role: Mighty Nein', 'bluud'],
        ['Critical Role: Mighty Nein', 'calianna'],
        ['Critical Role: Mighty Nein', 'essek'],
        ['Critical Role: Vox Machina', 'grog'],
        ['Miscellaneous','half-orc-paladin','Half-Orc Paladin'],
        ['Miscellaneous','he-man','He-Man'],
        ['Miscellaneous','link'],
        ['Critical Role: Vox Machina', 'percy'],
        ['Critical Role: Vox Machina', 'pike'],
        ['Critical Role: Mighty Nein', 'ruby', 'Marion Lavore'],
        ['Miscellaneous','skeleton'],
        ['Miscellaneous','skeletor'],
        ['Critical Role: Vox Machina', 'tiberius'],
        ['Critical Role: Vox Machina', 'vex']
        ['D&D Animated','acrobat'],
        ['D&D Animated','cavalier'],
        ['D&D Animated','thief'],
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
            height: '250px'
        },
        groups:[ 'Miscellaneous', 'Critical Role: Vox Machina', 'Critical Role: Mighty Nein', 'D&D Animated' ],
        items
    };
});