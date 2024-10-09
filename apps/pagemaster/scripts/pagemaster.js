namespace("sp.pagemaster.PageMaster", {
  'sp.common.Ajax':'Ajax',
  'sp.common.Dialog': 'Dialog',
  'sp.common.FileDownload': 'FileDownload',
  'sp.common.Header': 'Header',
}, ({ Ajax, Dialog, FileDownload, Header }) => {
  const about = [];
  const validateLoadFileJson = function (data) {};
  const RollTable = function({ table }) {
    return <>
      <tr>
        <td className="odd">1. { table[0] }</td>
        <td className="even">4. { table[1] }</td>
      </tr>
      <tr>
        <td className="even">2. { table[2] }</td>
        <td className="odd">5. { table[3] }</td>
      </tr>
      <tr>
        <td className="odd">3. { table[4] }</td>
        <td className="even">6. { table[5] }</td>
      </tr>
    </>;
  };
  const parseMarkdown = (markdown) => {
    let parsed = marked.parse(markdown).trim();
    if (parsed.startsWith("<p>")) {
      parsed = parsed.slice(3);
    }
    if (parsed.endsWith("</p>")) {
      parsed = parsed.slice(0,parsed.length - 4);
    }
    return parsed.replaceAll("<p></p>");
  } 
  const Marked = function({ value }) {
    return <span dangerouslySetInnerHTML={{__html: parseMarkdown(value)}}></span>
  }
  const MarkedOptional = function({ value, suffix }) {
    return <>{ value && value.length > 0 ? <span dangerouslySetInnerHTML={{__html: parseMarkdown(value+(suffix||" "))}}></span> : "" }</>
  }
  const MarkedList = function({ list }) {
    return <span dangerouslySetInnerHTML={{__html: parseMarkdown(list.join(", "))}}></span>
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.modals = Dialog.factory({
        fileDownload: {
          componentClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
      });
      this.menuItems = [
        {
          id: 'fileMenu',
          label: 'File',
          items: [
            {
              id: 'loadFile',
              label: 'Load File',
              callback: () => {
                this.loadFile();
              },
            },
            {
              id: 'download',
              label: 'Download File',
              callback: () => {
                this.modals.fileDownload.open({
                  fieldId:"pageMasterDataFileName",
                  placeholder:"pageMaster",
                  defaultFilename:"pageMaster",
                  jsonData:Object.assign({}, this.state)
                });
              },
            },
          ],
        },
        {
          id: 'about',
          label: 'About',
          callback: () => {
            Dialog.alert({ label: "PageMaster", lines: about });
          },
        }
      ];
    }
    loadFile() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const jsonData = JSON.parse(fileContent);
          const error = validateLoadFileJson(jsonData);
          if (error) {
            throw error;
          }
          this.setState(jsonData);
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    launchWizard() {}
    isCompleted() {
      return true;
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    afterRender() {
      if (!this.state.game && !this.state.fileError) {
        Ajax.getLocalStaticFileAsText(`./samples/magic-and-mischief.json`,
          {
            success: ({ responseText }) => {
              try{
                this.setState({ game: JSON.parse(responseText) });
              } catch (e) {
                console.log({ responseText, e });
                this.setState({ fileError: { responseText, e }})
              }
            },
            failure: (resp) => {
              console.log(resp);
              try {
                throw resp;
              } finally {
                this.setState({ fileError: { resp }})
              }
            },
            stateChange: (state) => {
              const progress = (100 * (state.state + 1)) / (state.max + 1);
              this.setState({progress})
            }
          });
      }
    }
    render() {
      return <>
        <Header menuItems={this.menuItems} appTitle={'PageMaster'} />
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-success m-2"
            onClick={() => this.launchWizard()}>
            Launch Wizard
          </button>
        </div>
        { this.isCompleted() && this.state.game && 
          <div className="m-3 row rpg-box">
            <div className="col-8">
              <h2>{ this.state.game.title }</h2>
              <p>You are a/an/the <MarkedOptional value={ this.state.game.setting.groupAdjective}/><Marked value={ this.state.game.setting.groupType}/> of/at <Marked value={this.state.game.setting.groupOrgTitle}/>. <MarkedOptional value={this.state.game.setting.groupGeneralPurpose} suffix=". "/><MarkedOptional value={this.state.game.setting.currentTimePlace} suffix=". "/><MarkedOptional value={this.state.game.setting.currentSituationProblem} suffix=". "/></p>
              <div className="row">
                <div className="col-6">
                  <h4>Players: Create Characters</h4>
                  <p><i className="fa-solid fa-1"></i>Choose a style for your character: <MarkedList list={this.state.game.characters.styles.map(s => `**${s}**`)}/></p>
                  <p><i className="fa-solid fa-2"></i>Choose a role for your character: <MarkedList list={this.state.game.characters.roles.map(s => `**${s}**`)}/></p>
                  <p><i className="fa-solid fa-3"></i>Choose your number, from 2 to 5. A high number means you're better at <Marked value={`**${this.state.game.dice.high.label}**`}/> <Marked value={this.state.game.dice.high.description}/>. A low number means you're better at <Marked value={`**${this.state.game.dice.low.label}**`}/> <Marked value={this.state.game.dice.low.description}/>.</p>
                  <p><i className="fa-solid fa-4"></i>Give your character a <strong><MarkedOptional value={this.state.game.characters.nameAdjective}/>name</strong>, like <MarkedList list={this.state.game.characters.nameExamples}/>.</p>
                  {this.state.game.characters.inventory.length > 0 && ((this.state.game.characters.inventory.length === this.state.game.characters.inventoryCount)?<>
                    <p><strong>You have:</strong> {this.state.game.characters.inventory.join(", ")}</p>
                  </>:<>
                    <p><strong>Pick {this.state.game.characters.inventoryCount} of the following:</strong> <MarkedList list={this.state.game.characters.inventory}/></p>
                  </>)}
                  <p><strong>Player Goal:</strong> Get your character involved in crazy adventures and try to come out relatively intact.</p>
                  <p><strong>Character Goal:</strong> Choose one or create your own: <strong><MarkedList list={this.state.game.characters.goals}/></strong></p>
                  <h4>Players: Create the/your {this.state.game.setting.groupOrgLabel}</h4>
                  { this.state.game.team.inventory.length > 0 && <p>As a team, pick {this.state.game.team.inventoryCount} of the following items: <MarkedList list={this.state.game.team.inventory}/></p> }
                  <p>As a team, pick {this.state.game.team.strengthCount} of the following strengths: <MarkedList list={this.state.game.team.strengths.map(s => `**${s}**`)}/></p>
                </div>
                <div className="col-6">
                  <p>As a team, pick {this.state.game.team.flawCount} of the following flaws: <MarkedList list={this.state.game.team.flaws}/></p>
                  <h4>Rolling The Dice</h4>
                  <p>When you do something risky, roll <strong>1d6</strong> to find out how it goes. Roll <strong>+1d</strong> if you're <strong>prepared</strong> and <strong>+1d</strong> if you're an <strong>expert</strong>. <em>(The storyteller tells you how many dice to roll, based on your character and the situation.) <strong>Roll your dice and compare each die result to your number.</strong></em></p>
                  <p><i className="fa-solid fa-down-long"></i>If you're using <Marked value={this.state.game.dice.high.label}/>, you want to roll <strong>under</strong> your number.</p>
                  <p><i className="fa-solid fa-up-long"></i>If you're using <Marked value={this.state.game.dice.low.label}/>, you want to roll <strong>over</strong> your number.</p>
                  <p><i className="fa-solid fa-0"></i><strong>If none of your dice succeed,</strong> it goes wrong. The storyteller says how things get worse somehow.</p>
                  <p><i className="fa-solid fa-1"></i><strong>If one die succeeds</strong>, you barely manage it. The storyteller inflicts a complication, harm, or cost.</p>
                  <p><i className="fa-solid fa-2"></i><strong>If two dice succeed</strong>, you do it well. Good Job!</p>
                  <p><i className="fa-solid fa-3"></i><strong>If three dice succeed</strong>, you get a critical success! The storyteller tells you some extra effect you get.</p>
                  <p><i className="fa-solid fa-exclamation"></i><strong>If you roll your number exactly</strong>, you have <Marked value={this.state.game.dice.exact.label}/>. You get a special insight into what's going on. <Marked value={this.state.game.dice.exact.description}/></p>
                </div>
              </div>
            </div>
            <div className="col-4">
              <p><strong>Helping:</strong> If you want to help someone else who's rolling, say how you try to help and make a roll. If you succeed, give them <strong>+1d6</strong></p>
              <h4>Storyteller: Create a Threat</h4>
              <p>Roll on or choose from the tables below</p>
              <table>
                <tbody>
                  <tr>
                    <th colSpan="2" className="odd">A THREAT...</th>
                  </tr>
                  <RollTable table={this.state.game.storyteller.table.table1}/>
                  <tr>
                    <th colSpan="2" className="even">WANTS TO...</th>
                  </tr>
                  <RollTable table={this.state.game.storyteller.table.table2}/>
                  <tr>
                    <th colSpan="2" className="odd">A/THE...</th>
                  </tr>
                  <RollTable table={this.state.game.storyteller.table.table3}/>
                  <tr>
                    <th colSpan="2" className="even">WHICH WILL...</th>
                  </tr>
                  <RollTable table={this.state.game.storyteller.table.table4}/>
                </tbody>
              </table>
              <p></p>
              <h4>Storyteller: Run The Game</h4>
              <p>Play to find out how they defeat the threat. Introduce the threat by showing evidence of it's recent badness. Before a threat does something to the characters, show signs that it's about to happen, then ask what they do. <MarkedList list={this.state.game.storyteller.samplePrompts.map(p => `*"${p}"*`)}/></p>
              <p>Call for a roll when the situation is uncertain. Don't pre-plan outcomes-let the chips fall where they may. Use Failures to push the action forward. The situation always changes after a roll, for good or ill.</p>
              <p>Ask questions and build on answers: <MarkedList list={this.state.game.storyteller.sampleQuestions.map(p => `*"${p}"*`)}/></p>
            </div>
          </div>
        }
      </>;
    }
  };
});