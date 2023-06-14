namespace('sp.roleScribe.CharacterSheetParser',{},() => {
    const delims = {
        xmark:"⊠",
        dot:"⊡",
        dash:"⊟"
    };
    const abilityLabels = [
        ['Strength','STR'],
        ['Dexterity','DEX'],
        ['Constitution','CON'],
        ['Intelligence','INT'],
        ['Wisdom','WIS'],
        ['Charisma','CHA'],
    ];
    const abilityMap = abilityLabels.reduce((out,[,ability],index) => {
        out[ability] = index;
        return out;
    }, {});
    const skillLabels = [
        ["Acrobatics",'DEX'],
        ["Animal Handling",'WIS'],
        ["Arcana",'INT'],

        ["Athletics",'STR'],
        ["Deception",'CHA'],
        ["History",'INT'],

        ["Investigation",'INT'],
        ["Insight",'WIS'],
        ["Intimidation",'CHA'],

        ["Medicine",'WIS'],
        ["Nature",'INT'],
        ["Perception",'WIS'],

        ["Performance",'CHA'],
        ["Persuasion",'CHA'],
        ["Religion",'INT'],

        ["Sleight Of Hand",'DEX'],
        ["Stealth",'DEX'],
        ["Survival",'WIS'],

        ["Initiative","DEX"]
    ];
    const dissoc = ((obj,fields) => {
        const retVal = Object.entries(obj).reduce((out,[key,value]) => {
            if (fields.indexOf(key) < 0) {
                out[key] = value;
            }
            return out;
        }, {});
        //console.log({ fields, keys: Object.keys(obj), retVal });
        return retVal;
    });
    const condenseFields = ((obj,condenseTo,fields) => {
        const condensed = fields.reduce((out,field) => {
            out[field] = obj[field]
            return out;
        }, {});
        const out = dissoc(obj,fields);
        out[condenseTo] = condensed;
        return out;
    });
    const mapTo = ((array,fields) => fields.reduce((out, field, index) => {
        if (field) {
            out[field] = array[index];
        }
        return out;
    }, {}));
    const pivot = ((table) => {
        const maxLength = table.reduce(((max,row) => Math.max(max,row.length)), 0);
        const out = [];
        for (let x = 0; x < maxLength; x++) {
            out.push(table.map((row) => row[x]));
        }
        return out;
    });
    const partition = ((array, size) => {
        let step = Array.from(array);
        const out = [];
        while (step.length >= size) {
            out.push(step.slice(0,size));
            step = step.slice(size);
        }
        return out;
    });
    const splitter = function(delim) {
        return ((value) => {
            //console.log({ value });
            return value.split(delim);
        });
    };
    const parseableFields = [
        "armorBonus","backgroundCode","baseSpeed","castingStatCode","currentHealth","currentTempHP","deathSaveFailures","deathSaveSuccesses","improvedInitiative","initMiscMod",
        "maxDex","maxHealth","miscArmorBonus","miscSpellAttackBonus","miscSpellDCBonus","offenseAbilityDisplay","pagePosition0","pagePosition1","pagePosition2","pagePosition3",
        "pagePosition4","proficiencyBonus","raceCode","shieldBonus","showDeathSaves","speedMiscMod","subraceCode","unarmoredDefense","version"
    ];
    const fieldParsers = {
        classData:splitter(delims.dash + delims.xmark),
        classResource:splitter(delims.xmark),
        hitDiceList:(value) => {
            const numbers = value.split(delims.xmark).map((n) => JSON.parse(n));
            const dice = partition(numbers.slice(1),3).map((row) => mapTo(row,["count","size","unused"]));
            return dice;
        },
        noteList:(value) => {
            return value.split(delims.xmark).map((v) => v.split("\n"));
        },
        spellList:splitter(delims.xmark),
        weaponList:splitter(delims.xmark),
    };
    const fieldParserList = [
        {
            field:"abilityScores",
            fn:(value,context) => {
                return pivot(partition(value.split(delims.xmark).map((v) => JSON.parse(v)),6).slice(0,3)).map((row,index) => {
                    const out = mapTo(row,['score','isSaveProficient','bonus']);
                    const [label,abrev] = abilityLabels[index];
                    out.label = label;
                    out.abrev = abrev;
                    out.modifier = Math.floor((out.score - 10)/2);
                    out.save = out.modifier + (out.isSaveProficient?context.proficiencyBonus:0);
                    return out;
                });
            },
        },
        {
            field:"skillInfo",
            fn:(value,context) => {
                //console.log({ value });
                return pivot(partition(value.split(delims.xmark).map((v) => JSON.parse(v)),19).slice(0,5)).map((row,index) => {
                    //console.log({ row, index });
                    const out = mapTo(row,['isProficient','bonus','hasExpertise','flag1','flag2']);
                    //console.log({ out });
                    const [ label, ability ] = skillLabels[index];
                    //console.log({ label, ability });
                    out.label = label;
                    out.ability = ability;
                    const abilityIndex = abilityMap[ability];
                    //console.log({ abilityIndex });
                    const modifier = context.abilityScores[abilityIndex].modifier + (out.isProficient?context.proficiencyBonus:0) + (out.hasExpertise?context.proficiencyBonus:0);
                    //console.log({ modifier });
                    out.modifier = modifier;
                    return out;
                });
            }
        }
    ]
    const charSheetXmlToJson = function(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        //console.log({ xml })
        let json = Array.from(xml.childNodes[0].childNodes).reduce((out, node) => {
            if(node.tagName) {
                out[node.tagName] = node.childNodes[0]?.nodeValue || "";
            }
            return out;
        }, {});
        //console.log({ parseableFields })
        parseableFields.forEach((field) => {
            if (json[field]) {
                json[field] = JSON.parse(json[field]);
            }
        })
        //console.log({ fieldParsers, json })
        Object.entries(fieldParsers).forEach(([field,parser]) => {
            //console.log({ field });
            if (json[field]) {
                json[field] = parser(json[field],json);
            }
        });
        //console.log({ fieldParserList, json });
        fieldParserList.forEach(({ field, fn }) => {
            //console.log({ field });
            if (json[field]) {
                json[field] = fn(json[field], json);
            }
        });
        //console.log({ dissoc: true });
        json = dissoc(json,[
            "pagePosition0","pagePosition1","pagePosition2","pagePosition3","pagePosition4","backgroundCode","raceCode","subraceCode","version"
        ]);
        //console.log({ condenseFields: true });
        const condensables = {
            "core":["armorBonus","baseSpeed","castingStatCode","maxHealth","proficiencyBonus","shieldBonus","unarmoredDefense"],
            "current":["currentHealth","currentTempHP","deathSaveFailures","deathSaveSuccesses"],
            "misc":["featCode","improvedInitiative","initMiscMod","maxDex","miscArmorBonus","miscSpellAttackBonus","miscSpellDCBonus","movementMode","multiclassFeatures","offenseAbilityDisplay","showDeathSaves","speedMiscMod"]
        }
        const retval = Object.entries(condensables).reduce((out,[k,v]) => {
            return condenseFields(out,k,v);
        }, json);
        //console.log({ retval });
        return retval;
    };

    return { parse: charSheetXmlToJson };
});