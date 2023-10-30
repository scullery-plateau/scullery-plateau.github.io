namespace('sp.outfitter.GallerySchematic',{},() => {
    const makeLabel = function(filename) {
        return filename.split("-").map(word => {
            return word.slice(0,1).toUpperCase() + word.slice(1);
        }).join(" ");
    };
    const items = [
        ['D&D Animated','acrobat'],
        ['Critical Role: Vox Machina', 'arkhan'],
        ['Critical Role: Bells Hells', 'ashton'],
        ['Critical Role: Mighty Nein', 'bluud'],
        ['Critical Role: Mighty Nein', 'calianna'],
        ['D&D Animated','cavalier'],
        ['Critical Role: Bells Hells', 'chetney-wolf'],
        ['Critical Role: Mighty Nein', 'essek'],
        ['Critical Role: Bells Hells', 'ferne'],
        ['Critical Role: Vox Machina', 'grog'],
        ['Miscellaneous','half-orc-paladin','Half-Orc Paladin'],
        ['Miscellaneous','he-man','He-Man'],
        ['Critical Role: Bells Hells', 'imogen'],
        ['Miscellaneous','link'],
        ['Critical Role: Vox Machina', 'percy'],
        ['Critical Role: Vox Machina', 'pike'],
        ['D&D Animated','presto'],
        ['D&D Animated','ranger'],
        ['Critical Role: Mighty Nein', 'ruby', 'Marion Lavore'],
        ['Miscellaneous','skeleton'],
        ['Miscellaneous','skeletor'],
        ['D&D Animated','thief'],
        ['Critical Role: Vox Machina', 'tiberius'],
        ['D&D Animated','venger'],
        ['Critical Role: Vox Machina', 'vex'],
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
        groups:[ 'Miscellaneous', 'Critical Role: Vox Machina', 'Critical Role: Mighty Nein', 'Critical Role: Bells Hells', 'D&D Animated' ],
        items
    };
});