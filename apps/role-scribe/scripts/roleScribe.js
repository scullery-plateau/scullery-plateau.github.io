namespace('sp.roleScribe.RoleScribe',{
    'sp.common.BuildAbout': 'buildAbout',
    'sp.common.Dialog':"Dialog",
    'sp.common.Header':'Header',
    'sp.common.LoadFile': 'LoadFile',
    'sp.roleScribe.CharacterSheetParser':'CharSheetParser',
},({ buildAbout, Dialog, Header, LoadFile, CharSheetParser }) => {
    const about = [
        // todo - about
    ];
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.modals = Dialog.factory({
                about:{
                    componentClass: buildAbout("Spritely",about),
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
                            <span className="vert-text">Mod</span>
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
                            <td className="text-center">{(modifier>0)?"+":""}{modifier}</td>
                            <td className="text-center">{(save>0)?"+":""}{save}</td>
                        </tr>
                    }) }
                </tbody>
            </table>;
        }
        publishSkills() {
            return <ul>
                { this.state.characterSheet.skillInfo.map(({ ability, modifier, hasExpertise, isSaveProficient, label }) => {
                    return <li>{label} ({ability}): {(modifier>0)?"+":""}{modifier}</li>;
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
                                  const characterSheet = CharSheetParser.parse(fileContent);
                                  console.log({ characterSheet });
                                  this.setState({ characterSheet });
                                },
                                (fileName, err) => {
                                    let { message, stack } = err;
                                    message = message.split("\n");
                                    stack = stack.split("\n");
                                    console.log({ fileName, message, stack });
                                    console.error(err);
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