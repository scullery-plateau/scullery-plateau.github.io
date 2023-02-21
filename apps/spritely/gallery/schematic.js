namespace('sp.spritely.GallerySchematic',{},() => {
    const makeLabel = function(filename) {
        return filename.split("-").map(word => {
            return word.slice(0,1).toUpperCase() + word.slice(1);
        }).join(" ");
    };
    const items = [
        ['Tiles','alternating-brick-floor'],
        ['Tiles','brazier-half-door'],
        ['Tiles','brick-corner'],
        ['Tiles','brick-edge'],
        ['Tiles','brick-wall'],
        ['Tiles','bubble-floor'],
        ['Tiles','bubbles'],
        ['Tiles','cave-corner'],
        ['Tiles','cave-edge'],
        ['Tiles','cave-floor'],
        ['Tiles','cave-wall'],
        ['Tiles','cement-corner'],
        ['Tiles','cement-edge'],
        ['Tiles','cement-wall'],
        ['Tokens','chest'],
        ['Tiles','diamond-tile-floor'],
        ['Tiles','door'],
        ['Tiles','doorway'],
        ['Tiles','double-brazier'],
        ['Characters','gelatinous-cube'],
        ['Tokens','green-potion'],
        ['Tiles','lawn-bottom-corner'],
        ['Tiles','lawn-side'],
        ['Tiles','lawn-top-corner'],
        ['Tiles','locked-door'],
        ['Characters','mimic'],
        ['Tiles','one-way-door'],
        ['Tokens','red-potion'],
        ['Tiles','shallow-water'],
        ['Tiles','sigil-floor-tile'],
        ['Tiles','simple-door'],
        ['Tiles','square-bubble-floor'],
        ['Tiles','stairs-door'],
        ['Tiles','stairs-down'],
        ['Tiles','statue'],
        ['Tiles','suit-of-armor'],
        ['Tiles','tile-floor']].map(([group,filename]) => {
            const label = makeLabel(filename);
            return { group, filename, label};
        }).reduce((out,obj) => {
            if(!out[obj.group]) {
                out[obj.group] = [];
            }
            out[obj.group].push(obj);
            return out;
        }, {});
    return {
        sourceApp: "Spritely",
        downloadExtension: ".json",
        imageExtension: ".png",
        style:{ 
            height: '64px' 
        },
        groups:[ 'Tiles', 'Tokens', 'Characters' ],
        items
    };
});