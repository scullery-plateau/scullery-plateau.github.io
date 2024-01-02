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
        ['D&D / Pathfinder','bugbear'],
        ['Critical Role: Mighty Nein', 'caleb'],
        ['Critical Role: Mighty Nein', 'calianna'],
        ['D&D Animated','cavalier'],
        ['Critical Role: Bells Hells', 'chetney-wolf'],
        ['Critical Role: Vox Machina', 'clarota'],
        ['Critical Role: Vox Machina', 'doty'],
        ['D&D / Pathfinder','drider'],
        ['Critical Role: Mighty Nein', 'essek'],
        ['Critical Role: Bells Hells', 'ferne'],
        ['D&D / Pathfinder','giff'],
        ['D&D / Pathfinder','goblin'],
        ['Critical Role: Vox Machina', 'grog'],
        ['D&D / Pathfinder','half-orc-paladin','Half-Orc Paladin'],
        ['Miscellaneous','he-man','He-Man'],
        ['D&D / Pathfinder','illithid'],
        ['Critical Role: Bells Hells', 'imogen'],
        ['Miscellaneous','link'],
        ['D&D / Pathfinder','nothic'],
        ['Critical Role: Mighty Nein', 'nott1'],
        ['Critical Role: Mighty Nein', 'nott2'],
        ['Critical Role: Bells Hells', 'orem'],
        ['Critical Role: Vox Machina', 'percy'],
        ['Critical Role: Vox Machina', 'pike'],
        ['D&D Animated','presto'],
        ['D&D Animated','ranger'],
        ['Critical Role: Mighty Nein', 'ruby', 'Marion Lavore'],
        ['D&D / Pathfinder','skeleton'],
        ['Miscellaneous','skeletor'],
        ['D&D Animated','thief'],
        ['Critical Role: Vox Machina', 'tiberius'],
        ['Miscellaneous','two-bad', "Two-Bad"],
        ['D&D Animated','venger'],
        ['Critical Role: Mighty Nein', 'veth'],
        ['Critical Role: Vox Machina', 'vex'],
        ['D&D / Pathfinder','zombie'],
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
        groups:[ 'Miscellaneous', 'Critical Role: Vox Machina', 'Critical Role: Mighty Nein', 'Critical Role: Bells Hells', 'D&D Animated', 'D&D / Pathfinder' ],
        items
    };
});