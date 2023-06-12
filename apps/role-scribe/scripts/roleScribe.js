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
    const skillLabels = [
        ["Athletics",'STR'],
        ["Acrobatics",'DEX'],
        ["Sleight Of Hand",'DEX'],
        ["Stealth",'DEX'],
        ["Arcana",'INT'],
        ["History",'INT'],
        ["Investigation",'INT'],
        ["Nature",'INT'],
        ["Religion",'INT'],
        ["Religion",'INT'],
        ["Animal Handling",'WIS'],
        ["Insight",'WIS'],
        ["Medicine",'WIS'],
        ["Perception",'WIS'],
        ["Survival",'WIS'],
        ["Deception",'CHA'],
        ["Intimidation",'CHA'],
        ["Performance",'CHA'],
        ["Persuasion",'CHA'],
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
    const fieldParsers = {
        abilityScores:(value) => {
            return pivot(partition(value.split(delims.xmark).map((v) => JSON.parse(v)),6).slice(0,3)).map((row,index) => {
                const out = mapTo(row,['score','isSaveProficient','bonus']);
                const [label,abrev] = abilityLabels[index];
                out.label = label;
                out.abrev = abrev;
                return out;
            });
        },
        classData:splitter(delims.dash + delims.xmark),
        classResource:splitter(delims.xmark),
        hitDiceList:(value) => {
            const numbers = value.split(delims.xmark).map((n) => JSON.parse(n));
            const count = numbers[0];
            const dice = partition(numbers.slice(1),3).map((row) => mapTo(row,["count","size","unused"]));
            return dice;
        },
        noteList:(value) => {
            return value.split(delims.xmark).map((v) => v.split("\n"));
        },
        skillInfo:(value) => {
            return pivot(partition(value.split(delims.xmark).map((v) => JSON.parse(v)),19).slice(0,5)).map((row,index) => {
                const out = mapTo(row,['isProficient','bonus','hasExpertise','flag1','flag2']);
                const [label,ability] = skillLabels[index];
                out.label = label;
                out.ability = ability;
                return out;
            });
        },
        spellList:splitter(delims.xmark),
        weaponList:splitter(delims.xmark),
        proficiencyBonus:parseInt,

    };
    const charSheetXmlToJson = function(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        const json = Array.from(xml.childNodes[0].childNodes).reduce((out, node) => {
            if(node.tagName) {
                out[node.tagName] = node.childNodes[0]?.nodeValue || "";
            }
            return out;
        }, {});
        Object.entries(fieldParsers).forEach(([field,parser]) => {
            json[field] = parser(json[field]);
        });
        console.log(json);
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
                            <table className="ability-scores">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="vert-text">Score</th>
                                        <th className="vert-text">Modifier</th>
                                        <th className="vert-text">Save</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.characterSheet.abilityScores.map((stat) => {
                                        const modifier = Math.floor((stat.score - 10)/2);
                                        const save = modifier + (stat.isSaveProficient?this.state.characterSheet.core.proficiencyBonus:0);
                                        return <tr>
                                            <th className="text-right">{stat.abrev}</th>
                                            <td className="text-center">{stat.score}</td>
                                            <td className="text-center">{modifier}</td>
                                            <td className="text-center">{save}</td>
                                        </tr>
                                    }) }
                                </tbody>
                            </table>
                        </div>
                    </>}
            </>);
        }
    }
})