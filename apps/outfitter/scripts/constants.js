namespace('sp.outfitter.Constants', () => {
    const partLayers = [ 'base', 'detail', 'outline', 'shadow' ];
    const partGroups = [
        "Body",
        "Face",
        "Tights",
        "Clothing",
        "Back",
        "Accessories",
    ];
    const partTypes = [
        ["accessories_and_shields","Accessories","Accessories & Shields"],
        ["arm","Body"],
        ["back","Back"],
        ["beard","Face"],
        ["belt","Clothing"],
        ["boots","Clothing"],
        ["chest","Clothing"],
        ["collar","Clothing"],
        ["ears","Face"],
        ["eyebrows","Face"],
        ["eyes","Face"],
        ["gauntlets","Clothing"],
        ["gloves","Tights"],
        ["guns","Accessories"],
        ["hair","Face"],
        ["hat","Clothing"],
        ["head","Body"],
        ["legs","Body"],
        ["mask","Tights"],
        ["melee_weapons","Accessories","Melee Weapons"],
        ["mouth","Face"],
        ["nose","Face"],
        ["pants","Clothing"],
        ["ranged_weapons","Accessories","Ranged Weapons"],
        ["shirt","Tights"],
        ["sholders","Clothing","Shoulders"],
        ["stockings","Tights"],
        ["swords","Accessories"],
        ["symbol_A","Accessories","Symbol A"],
        ["symbol_B","Accessories","Symbol B"],
        ["tights","Tights","Leggings"],
        ["torso","Body"],
        ["wings_and_tails","Back", "Wings & Tails"]
      ].reduce((out, [part, group, label]) => {
        const temp = { part, group };
        temp.label = label || (part.charAt(0).toUpperCase() + part.substr(1).toLowerCase());
        if (out[temp.group]) {
          out[temp.group].push(temp);
        } else {
          out[temp.group] = [temp];
        }
        return out;
      }, {});
      const getPartLayers = function() {
        return Array.from(partLayers);
    }
    const getPartGroups = function() {
        return Array.from(partGroups);
    }
    const getPartTypesByGroup = function(group) {
        return Array.from(partTypes[group]);
    }
    return { getPartLayers, getPartGroups, getPartTypesByGroup };
});