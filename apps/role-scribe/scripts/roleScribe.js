namespace('sp.roleScribe.RoleScribe',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog':"Dialog",
    'sp.common.Header':'Header',
    'sp.common.LoadFile': 'LoadFile',
},({ buildAbout, Dialog, Header, LoadFile }) => {
    const about = [
        // todo - about
    ];
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
    ];
    const dissoc = ((obj,fields) => {
        const retVal = Object.entries(obj).reduce((out,[key,value]) => {
            if (fields.indexOf(key) < 0) {
                out[key] = value;
            }
            return out;
        }, {});
        console.log({ fields, keys: Object.keys(obj), retVal });
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
        return ((value) => value.split(delim));
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
                return pivot(partition(value.split(delims.xmark).map((v) => JSON.parse(v)),19).slice(0,5)).map((row,index) => {
                    const out = mapTo(row,['isProficient','bonus','hasExpertise','flag1','flag2']);
                    const [label,ability] = skillLabels[index];
                    out.label = label;
                    out.ability = ability;
                    const abilityIndex = abilityMap[ability];
                    out.modifier = context.abilityScores[abilityIndex].modifier + (out.isProficient?context.proficiencyBonus:0) + (out.hasExpertise?context.proficiencyBonus:0);
                    return out;
                });
            }
        }
    ]
    const charSheetXmlToJson = function(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        const json = Array.from(xml.childNodes[0].childNodes).reduce((out, node) => {
            if(node.tagName) {
                out[node.tagName] = node.childNodes[0]?.nodeValue || "";
            }
            return out;
        }, {});
        parseableFields.forEach((field) => {
            try {
                json[field] = JSON.parse(json[field]);
            } catch ({ message, stack }) {
                console.log({ field, message, stack });
            }
        })
        Object.entries(fieldParsers).forEach(([field,parser]) => {
            json[field] = parser(json[field],json);
        });
        fieldParserList.forEach(({ field, fn }) => {
            json[field] = fn(json[field], json);
        });
        return condenseFields(condenseFields(condenseFields(dissoc(json,[
            "pagePosition0","pagePosition1","pagePosition2","pagePosition3","pagePosition4","backgroundCode","raceCode","subraceCode","version"
        ]),"core",[
            "armorBonus","baseSpeed","castingStatCode","maxHealth","proficiencyBonus","shieldBonus","unarmoredDefense"
        ]),"current",[
            "currentHealth","currentTempHP","deathSaveFailures","deathSaveSuccesses"
        ]),"misc",[
            "featCode","improvedInitiative","initMiscMod","maxDex","miscArmorBonus","miscSpellAttackBonus","miscSpellDCBonus","movementMode",
            "multiclassFeatures","offenseAbilityDisplay","showDeathSaves","speedMiscMod"
        ]);
    };
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                about:{
                    templateClass: buildAbout("Spritely",about),
                    attrs: { class: 'rpg-box text-light w-75' },
                    onClose: () => {}
                }
            });
            this.menuItems = [
                {
                    id: 'about',
                    label: 'About',
                    callback: () => {
                        this.modals.about.open();
                    },
                }
            ];
        }
        publishAbilityScores() {
            return <table className="ability-scores">
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            <span className="vert-text">Score</span>
                        </th>
                        <th>
                            <span className="vert-text">Modifier</span>
                        </th>
                        <th>
                            <span className="vert-text">Save</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { this.state.characterSheet.abilityScores.map(({ abrev, score, modifier, save }) => {
                        return <tr>
                            <th className="text-right">{abrev}</th>
                            <td className="text-center">{score}</td>
                            <td className="text-center">{modifier}</td>
                            <td className="text-center">{save}</td>
                        </tr>
                    }) }
                </tbody>
            </table>;
        }
        publishSkills() {
            return <ul>
                { this.state.characterSheet.skillInfo.map(({ ability, modifier, hasExpertise, isSaveProficient, label }) => {
                    return <li>{label} ({ability}): {modifier}</li>;
                }) }
            </ul>;
        }
        render() {
            return (<>
                <Header menuItems={this.menuItems} appTitle={"Walter's Print Shop"}/>
                { !this.state.characterSheet ?
                    <button 
                        className="btn btn-success"
                        onClick={() => {
                            LoadFile(
                                false,
                                'text',
                                (fileContent) => {
                                  const characterSheet = charSheetXmlToJson(fileContent);
                                  console.log({ characterSheet });
                                  this.setState({ characterSheet });
                                },
                                (fileName, { message, stack }) => {
                                    message = message.split("\n");
                                    stack = stack.split("\n");
                                    console.log({ fileName, message, stack });
                                    alert(fileName + ' failed to load. See console for error.');
                                }
                            );
                        }}
                    >Open Character Sheet XML</button> : <>
                        <div>
                            { this.publishAbilityScores() }
                            { this.publishSkills() }
                        </div>
                    </>}
            </>);
        }
    }
})