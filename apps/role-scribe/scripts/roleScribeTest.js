namespace('sp.roleScribe.RoleScribeTest',{
    'sp.common.Ajax':'Ajax',
    'sp.roleScribe.CharacterSheetParser':'charSheetParser'
},({ Ajax, charSheetParser }) => {
    const samples = [
        "BaronCrispianDale_Fighter4Ranger3",
        "BaronessAzani_Druid11",
        "Be_Barbarian10",
        "Bow_Ranger5",
        "Corzo_Fighter5Rogue3",
        "CountlessCarolinia_Fighter4Monk3",
        "DevinshirePoe_Paladin5",
        "Doc_Artificer3",
        "Drago_Monk5",
        "Drizzt_Rogue8",
        "DrZanaHaranthi_Fighter3Monk4",
        "DukeHalifax_Bard3Fighter4",
        "Dylan_Sorcerer4",
        "Gail_Wizard4",
        "Gavin_Druid4",
        "Hanseld_Rogue4Wizard2",
        "Hanseld_Rogue5",
        "Hanseld_Rogue5Wizard3",
        "HarbinWester_Wizard3",
        "Hello_Cleric5",
        "Heymanwhohasbeenredesignedfromyouandtherestofus_Cleric20",
        "Hitch_Rogue5Fighter1",
        "Krug_Paladin5",
        "LantheonVaazrus_Monk4",
        "Lark_Ranger5",
        "Miendorf_Wizard5",
        "Molly_Cleric4Bard3",
        "Munro_Wizard4Warlock4",
        "MunroAndelmaus_Wizard6Warlock4",
        "Osciril_Rogue6Warlock4",
        "Otaku_Fighter4",
        "PetrucciAgincourt_Rogue2",
        "Piper_Bard4Cleric3",
        "PiperRixi_Fighter5",
        "Rar_Druid5",
        "Roar_Sorcerer5",
        "Rupert_Bard4Barbarian2",
        "SimonDale_Bard1",
        "Skip_Fighter5",
        "Thug_Rogue4",
        "Tobish_Rogue6",
        "Tom_Bard4",
        "WilliamOfWaterdeep_Bard10Fighter5",
        "ZarkananRangoth_Cleric8Monk4",
        "ZathustraDale_Druid1",
    ];
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                results: {}
            };
        }
        componentDidMount() {
            const results = {};
            samples.forEach((fileName) => {
                Ajax.getLocalStaticFileAsText(`samples/${fileName}.xml`,{
                    success:({ requestedFile, responseText }) => {
                        try {
                            const json = charSheetParser.parse(responseText);
                            results[requestedFile] = { success: json };
                        } catch ({ stack, message }) {
                            results[requestedFile] = { stack: stack.split("\n") };
                        }
                        this.setState({ results });
                    },
                    failure:({ requestedFile, status, statusText, responseText }) => {
                        results[requestedFile] = { message: [ `${status} - ${statusText}: ${requestedFile}` ]};
                        this.setState({ results });
                    }
                })
            })
        }
        render() {
            const { successes, failures } = Object.entries(this.state.results).reduce(({ successes, failures }, [filename, { success, message, stack }]) => {
                const error = stack ? stack : message;
                if (error) {
                    failures[filename] = error;
                } else {
                    console.log({ filename, success });
                    successes.push(filename);
                }
                return { successes, failures };
            }, { successes: [], failures: {} })
            return <div className="text-info">
                <h3>Test Results</h3>
                <h4>Failures</h4>
                <ul>
                    { Object.entries(failures).map(([filename,error]) => {
                        return <li key={filename}>
                            <h5>{filename}</h5>
                            <ul className="text-danger">
                                { error.map((step,index) => {
                                    return <li key={filename + "-stack-" + index}>
                                        <h5>{step}</h5>
                                    </li>;
                                }) }
                            </ul>
                        </li>
                    }) }
                </ul>
                <h4>Successes</h4>
                <ul>
                    { successes.map((filename) => {
                        return <li key={filename}>
                            <h5>{filename}</h5>
                        </li>;
                    }) }
                </ul>
            </div>;
        }
    }
});
