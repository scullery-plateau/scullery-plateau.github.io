namespace('sp.runyon.Runyon',{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.Dialog':'Dialog',
  'sp.common.Header':'Header',
  'sp.common.Utilities':'util'
},({ buildAbout, Dialog, Header, util }) => {
  const about = [];
  const initStateDice = {
    count:1,
    results:[],
    holds:{}
  };
  const initState = { dice: [util.merge(initStateDice,{size:20})], addend: 0, hilo: false };
  const diceSizes = [20,12,10,8,6,4,100];
  const maxSize = Math.max.apply(null, diceSizes);
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = initState;
      this.modals = Dialog.factory({
        about: {
          componentClass: buildAbout("Spritely", about),
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: () => {
          },
        },
      });
      this.menuItems = [{
        id: 'toggleHiLo',
        label: 'Toggle Lowest & Highest',
        callback: () => {
          this.setState({ hilo: !this.state.hilo });
        }
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        },
      }];
    }
    roll() {
      const dice = this.state.dice.map(({ size, count, results, holds }) => {
        const newResults = util.range(count).map((i) => {
          if (holds['i'+i]) {
            return results[i];
          } else {
            return 1 + Math.floor(Math.random() * size);
          }
        });
        return { size, count, results: newResults, holds };
      });
      this.setState({ dice });
    }
    hold(die,index) {
      this.setState(util.toggleIn(this.state,['dice', die,'holds','i'+index]));
    }
    render() {
      const { max: diceMaxSize, diceRolled } = this.state.dice.reduce(({max,diceRolled},dice) => {
        return {
          max:Math.max(max,dice.size),
          diceRolled: diceRolled + dice.results.length
        }
      },{max:0,diceRolled:0})
      return <>
        <Header menuItems={this.menuItems} appTitle={'Runyon'} />
        <div className="d-flex flex-column justify-content-center">
          <button className="btn btn-success" onClick={() => this.roll()}>Roll</button>
          <div className="d-flex justify-content-center rpg-box m-3">
            <table className="table text-light">
              <thead>
              </thead>
              <tbody>
              <tr>
                <th>Die Size</th>
                <th>Count</th>
                <th>Rolls</th>
                { this.state.hilo && <>
                  <th>Lowest</th>
                  <th>Highest</th>
                </>}
                <th>Sum</th>
              </tr>
              {
                this.state.dice.map((dice,dieIndex) => {
                  return <tr key={`die#${dieIndex}`}>
                    <td>
                      <div className="d-flex justify-content-center">
                        <select
                          className="form-control text-center"
                          style={{width:'4em'}}
                          value={ dice.size }
                          onChange={(e) => {
                            this.setState(util.updateIn(this.state,['dice',dieIndex,'size'],parseInt(e.target.value)));
                          }}
                        >
                          {diceSizes.map((size) => {
                            return <option key={`die#${dieIndex}-size${size}`} value={size}>d{size}</option>
                          })}
                        </select>
                        { dieIndex > 0 &&
                          <button
                            className="ms-2 btn btn-danger"
                            onClick={() => {
                              const allDice = this.state.dice.map(({ size, count, results, holds }) => {
                                return { size, count, results: Array.from(results), holds: util.merge(holds) };
                              });
                              allDice.splice(dieIndex,1);
                              this.setState({ dice: allDice });
                            }}
                          >X</button>
                        }
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <input
                          id={`die#${dieIndex}-count`}
                          type="number"
                          className="form-control text-center"
                          style={{width:'4em'}}
                          min={0}
                          value={ dice.count }
                          onChange={(e) => {
                            const allDice = this.state.dice.map(({ size, count, results, holds }) => {
                              return { size, count, results: Array.from(results), holds: util.merge(holds) };
                            });
                            const { size, results } = allDice[dieIndex];
                            const newCount = parseInt(e.target.value);
                            allDice[dieIndex] = {
                              size,
                              count: newCount,
                              results: results.slice(0,newCount),
                              holds:{}
                            };
                            this.setState({ dice: allDice });
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      {
                        dice.results.map((result,holdIndex) => {
                          const held = dice.holds['i'+holdIndex];
                          return <button
                            key={`hold-die#${dieIndex}-i${holdIndex}`}
                            title={held?"Held":"Hold?"}
                            className={`fs-5 ms-1 me-1 btn ${held?'btn-info':'btn-outline-light'}`}
                            onClick={() => {
                              this.hold(dieIndex,holdIndex);
                            }}
                          >{result}</button>
                        })
                      }
                      {
                        Object.keys(dice.holds).length > 0 &&
                        <button
                          title="Clear Holds"
                          className={`ms-3 btn btn-warning`}
                          onClick={() => {
                            this.setState(util.updateIn(this.state,['dice',dieIndex,'holds'],{}))
                          }}
                        >-</button>
                      }
                    </td>
                    { this.state.hilo && <>
                      <td>{ dice.results.length > 1 && dice.results.reduce((a,b) => Math.min(a,b), dice.size) }</td>
                      <td>{ dice.results.length > 1 && dice.results.reduce((a,b) => Math.max(a,b), 0) }</td>
                    </>}
                    <td>{ dice.results.length > 0 && dice.results.reduce((a,b) => a + b, 0) }</td>
                  </tr>;
                })
              }
              <tr>
                <td>Add</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <input
                      id="addend"
                      type="number"
                      className="form-control text-center"
                      style={{width:'4em'}}
                      value={ this.state.addend }
                      onChange={(e) => {
                        this.setState({ addend: parseInt(e.target.value)});
                      }}
                    />
                  </div>
                </td>
                <td></td>
                { this.state.hilo && <>
                  <td></td>
                  <td></td>
                </>}
                <td>{this.state.addend > 0 && this.state.addend}</td>
              </tr>
              {
                diceRolled > 0 &&
                <tr>
                  <th className="fs-4">Total</th>
                  <td></td>
                  <td></td>
                  { this.state.hilo && <>
                    <th className="fs-6">{ diceRolled > 1 && this.state.dice.reduce((min,dice) => {
                      return dice.results.reduce((a,b) => Math.min(a,b), min)
                    },diceMaxSize)}</th>
                    <th className="fs-6">{ diceRolled > 1 && this.state.dice.reduce((max,dice) => {
                      return dice.results.reduce((a,b) => Math.max(a,b), max)
                    },0)}</th>
                  </>}
                  <th className="fs-3">{this.state.dice.reduce((sum,dice) => {
                      return dice.results.reduce((a,b) => a + b, sum)
                    },this.state.addend)}</th>
                </tr>
              }
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-success"
            onClick={() => {
              const dice = Array.from(this.state.dice);
              dice.push(util.merge(initStateDice,{ size: 20 }))
              this.setState({ dice })
            }}
          >Add Dice</button>
          <p></p>
          <button className="btn btn-danger" onClick={() => {
            this.setState(initState);
          }}>Clear</button>
        </div>
      </>;
    }
  }
});