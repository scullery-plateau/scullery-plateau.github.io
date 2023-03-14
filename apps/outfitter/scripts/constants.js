namespace('sp.outfitter.Constants', () => {
    const partGroups = [
        "Body",
        "Face",
        "Tights",
        "Clothing",
        "Back",
        "Accessories",
    ];
    const partTypeList = [
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
    ];
    const partTypes = partTypeList.reduce((out, [part, group, label]) => {
      const temp = { part, group };
      temp.label = label || (part.charAt(0).toUpperCase() + part.substr(1).toLowerCase());
      if (out[temp.group]) {
        out[temp.group].push(temp);
      } else {
        out[temp.group] = [temp];
      }
      return out;
    }, {});
    const partLabels = Object.values(partTypes).reduce((out,v) => {
      return v.reduce((acc,{ part, label })=>{
        out[part] = label;
        return out;
      },out);
    }, {});
    const getPartGroups = function() {
        return Array.from(partGroups);
    }
    const getPartTypesByGroup = function(group) {
        return Array.from(partTypes[group]);
    }
    const getPartTypeIndicies = function(partType) {
      const targetGroups = Object.entries(partTypes).map(([group,types]) => [group,types.map(t => t.part).indexOf(partType)]).filter(([group,typeIndex]) => typeIndex >= 0);
      if (targetGroups.length !== 1) {
        throw "Invalid part Type"
      }
      const [group,typeIndex] = targetGroups[0];
      return [partGroups.indexOf(group),typeIndex];
    }
    const getPartLabel = function(labelTypeId) {
      return partLabels[labelTypeId];
    }
    const getLayerLabel = function(index,layer) {
      return <>{index}: { getPartLabel(layer.part) } {layer.index}{layer.flip?" flipped":""}{layer.base?`, Base: ${layer.base}`:""}{layer.detail?`, Detail: ${layer.detail}`:""}{layer.outline?`, Outline: ${layer.outline}`:""}</>;
    }
    return { getPartGroups, getPartTypesByGroup, getPartTypeIndicies, getPartLabel, getLayerLabel };
});