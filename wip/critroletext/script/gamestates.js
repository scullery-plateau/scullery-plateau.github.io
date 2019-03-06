(function(){
  registry.apply("GameStates",["Roller","Template","GameRules"],function(Roller,Template,GameRules){
    var sizes = ["tiny","small","medium","large","huge","gargantuan"];
    var delayedUpdate = function(ui,ctx,update) {
      return function(){
        ctx.trigger.fire(update);
      }
    }
    var rollInitiative = function(ctx) {
      return function(member) {
        var result = Roller.roll(20);
        member.order = result + member.initiative;
        ctx.order.push(member);
      }
    }
    var calcDamage = function(ui,ctx) {
      var damageLogs = Roller.rollDamage(ctx.turn.attack.damage,ctx.successes);
      var damage = damageLogs.pop();
      ctx.target.health = ctx.target.health - damage;
      delete ctx.successes;
      damageLogs.map(function(log){
        return ctx.turn.attack.name + " does " + log;
      }).forEach(ui.console.println);
      ui.console.after(delayedUpdate(ui,ctx,{
        state:"damage",
        damage:damage
      }));
    }
    var sortDirections = {
      "asc":function(a,b) {
        return a - b;
      },
      "desc":function(a,b) {
        return b - a;
      }
    }
    var sortFields = ["distance","attack","armor","speed","size","health","maxHealth","maxDamage","avgDamage"];
    var buildSorter = function(strategy) {
      var ordering = strategy.split(",").map(function(field) {
        field = field.trim().split(" ");
        var fieldIndex = sortFields.indexOf(field[0]);
        var dir = sortDirections[field[1]];
        if (!dir) {dir = sortDirections.asc}
        field = undefined;
        if (fieldIndex >= 0) { field = sortFields[fieldIndex]; }
        return {field:field,dir:dir};
      }).filter(function(f){
        return f.field;
      })
      return function(a,b) {
        for (var index = 0; index < ordering.length; index++) {
          var field = ordering[index].field;
          var dir = ordering[index].dir;
          var result = dir(a[field],b[field]);
          if (result != 0) {
            return result;
          }
        }
        return 0;
      }
    }
    var attackResults = {
      "hit":["${turn.name} hits ${target.name}!",
            "${turn.name} does ${damage} of damage to ${target.name}"],
      "hits":["${turn.name} hits ${target.name} ${successes} times!",
            "${turn.name} does ${damage} of damage to ${target.name}"],
      "miss":["${turn.name} misses ${target.name}."]
    }
    var validateOneOf = function(returnVal,options) {
      return function(ui,ctx,value) {
        if ((typeof options) == "function") {
          options = options(ui,ctx);
        }
        var index = options.map(function(o){return o.toLowerCase();}).indexOf(value.toLowerCase());
        if (index < 0) {
          throw "'" + value + "' is not valid. Must be one of '" + options.join("','") + "'";
        }
        return returnVal;
      }
    }
    var attackResult = function(successes) {
      if (successes > 0) {
        if (successes > 1) {
          return "hits"
        } else {
          return "hit";
        }
      } else {
        return "miss";
      }
    }
    return  {
      "init":{
        "prompt":[],
        "auto":function(ui,ctx){
          ctx.prologue.forEach(ui.console.println);
          ui.console.after(delayedUpdate(ui,ctx,{state:"start"}));
        }
      },
      "start":{
        "prompt":["Click on, tap on, or type (then hit 'ENTER') the highlighted option of your choice as directed.",
                  "Press any key or click or tap anywhere to complete text."],
        "opts":["Start Game"],
        "input":validateOneOf({state:"drawMap"},["Start Game"])
      },
      "drawMap":{
        "prompt":[],
        "auto":function(ui,ctx){
          ui.map.draw();
          ui.map.after(delayedUpdate(ui,ctx,{state:"initiative"}));
        }
      },
      "initiative":{
        "prompt":["Roll for initiative!"],
        "auto":function(ui,ctx) {
          ctx.order = [];
          ctx.party.forEach(rollInitiative(ctx));
          ctx.foes.forEach(rollInitiative(ctx));
          ctx.order.sort(function(a,b){
            return b.order - a.order;
          });
          ctx.order.filter(function(member){
            return member.player == "player";
          }).map(function(member){
            return member.name + " - " + member.order;
          }).forEach(ui.console.println);
          console.log("full initiative order");
          ctx.order.forEach(function(member) {
            console.log(member.name + " - " + member.order);
          })
          ctx.turn = ctx.order.shift();
          ui.console.after(delayedUpdate(ui,ctx,{state:"turn"}));
        }
      },
      "turn":{
        "prompt":["","It is ${turn.name}'s turn!"],
        "auto":function(ui,ctx) {
          if (ctx.turn.player == "player") {
            if (ctx.turn.deathsaves) {
              return {state:"deathsaves"};
            } else if (ctx.turn.unconscious) {
              return {state:"unconscious"}
            } else {
              ctx.actions = {"move":"Move","attack":"Attack","info":"Info","end turn":"End Turn"};
              ctx.actionLabels = Object.values(ctx.actions).join(", ");
              return {state:"combat"};
            }
          } else {
            return {state:"npc-combat"};
          }
        }
      },
      "unconscious":{
        "prompt":["${target.name} is still unconscious.",
                  "Skipping their turn."],
        "auto":{state:"nextTurn"}
      },
      "deathsaves":{
        "prompt":["${target.name} is dying.",
                  "Rolling death saving throw..."],
        "auto":function(ui,ctx) {
          var deathsave = {value:Roller.roll(20)};
          if (deathsave.value == 20) {
            delete ctx.target.deathsaves
            ctx.target.health = 1;
            deathsave.action = "has regained one point of health!"
          } else if (deathsave.value == 1) {
            ctx.target.deathsaves.fail = ctx.target.deathsaves.fail + 2;
          } else if (deathsave.values >= 10) {
            ctx.target.deathsaves.success = ctx.target.deathsaves.success + 2;
          } else {
            ctx.target.deathsaves.fail = ctx.target.deathsaves.fail + 1;
          }
          deathsave.nextState = "nextTurn";
          if (ctx.target.deathsaves.fail >= 3) {
            deathsave.nextState = "deadhero";
            deathsave.action = "was unable to recover!"
            delete ctx.target.deathsaves;
          } else if (ctx.target.deathsaves.success >= 3) {
            deathsave.action = "has stablized! They are still unconscious, but are no longer dying."
            delete ctx.target.deathsaves;
            ctx.target.unconscious = true;
          }
          return {state:"deathsavesresult",deathsave:deathsave};
        }
      },
      "deathsavesresult":{
        "prompt":["${target.name} has rolled a ${deathsave.value} for their death save.",
                  "${target.name} ${deathsave.action}"],
        "auto":function() {
          var state = ctx.deathsave.nextState;
          delete ctx.deathsave;
          return {state:state};
        }
      },
      "npc-combat":{
        "prompt":[],
        "auto":function(ui,ctx) {
          var npc = ctx.turn;
          var priorities = ctx.party.map(function(m) {
            var out = {
              attack:m.attack.bonus,
              armor:m.armor,
              speed:m.movement,
              size:sizes.indexOf(m.size),
              health:m.health,
              maxHealth:m.maxHealth,
              maxDamage:(Roller.maxDamage(m.attack.damage) * (m.attack.perTurn?m.attack.perTurn:1)),
              avgDamage:(Roller.avgDamage(m.attack.damage) * (20 - (npc.armor - m.attack.bonus)))
            };
            return out;
          });
          var available = ui.map.openAdjacentWithinRangeOfFoe().map(function(o) {
            var obj = JSON.parse(JSON.stringify(priorities[o.index]));
            obj.index = o.index;
            obj.open = o.open;
            obj.distance = o.distance;
            return obj;
          });
          available.sort(buildSorter(npc.strategy));
          var move = available[0];
          var newPos = move.open;
          ctx.target = ctx.party[move.index];
          var rollLog = Roller.rollAttacks(npc.attack.perTurn,npc.attack.bonus,ctx.target.armor);
          ctx.successes = rollLog.pop();
          ctx.damage = Roller.rollDamage(npc.attack.damage,ctx.successes).pop();
          var tplPrinter = Template.buildTemplatePrinter(ctx,ui.console)
          var result = attackResult(ctx.successes);
          ctx.target.health = ctx.target.health - ctx.damage;
          var update = {state:"nextTurn"};
          if (ctx.target.health < 0) {
            if (Math.abs(ctx.target.health) > ctx.target.maxHealth) {
              update.state = "deadhero";
            } else {
              ctx.target.deathsaves = {"success":0,"fail":0};
            }
          }
          [("${turn.name} has chosen to move to " + newPos + ".")].forEach(tplPrinter);
          var afterMap = ["${turn.name} has chosen to attack ${target.name}.",
          "${turn.name} makes ${turn.attack.perTurn} attack${turn.attack.perTurn>1?'s':''} with ${turn.attack.name}.",
          "Rolling for attack..."].concat(rollLog,attackResults[result]);
          ui.console.after(function(){
            ui.map.moveFoe(npc.mapListing,newPos);
            ui.map.after(function(){
              afterMap.forEach(tplPrinter);
              ui.console.after(function() {
                delete ctx.successes;
                delete ctx.damage;
                delayedUpdate(ui,ctx,update)();
              })
            })
          })
        }
      },
      "combat":{
        "prompt":["What do you wish to do?"],
        "opts":function(ui,ctx){
          return Object.values(ctx.actions);
        },
        "input":function(ui,ctx,value) {
          var option = ctx.actions[value.toLowerCase()];
          if (!option) {
            throw "'" + value + "' is not a valid input; must be one of " + ctx.actionLabels;
          }
          if (value.toLowerCase() != "info") {
              delete ctx.actions[value.toLowerCase()];
          }
          ctx.actionLabels = Object.values(ctx.actions).join(", ");
          var states = {"Move":"move","Attack":"target","Info":"info"};
          var state = states[option];
          if (!state) {state = "nextTurn";}
          return {state:state};
        }
      },
      "info":{
        "prompt":["",
                  "${turn.name}",
                  "  Health:            ${turn.health}",
                  "  Max Health:        ${turn.maxHealth}",
                  "  Speed:             ${turn.movement}",
                  "  Armor:             ${turn.armor}",
                  "  Weapon Of Choice:  ${turn.attack.name}",
                  "  Attack Bonus:      ${turn.attack.bonus}"],
        "auto":function(ui,ctx){
          var output = [];
          if (ctx.turn.attack.range) {
            output.push("  Range:             [" + ctx.turn.range.join(", ") + "]")
          }
          output.push(Object.entries(ctx.turn.attack.damage).reduce(function(out,entry){
            out.push(entry[1] + " (" + entry[0] + ")");
            return out;
          },[]).join(" + "));
          output.push("");
          output.forEach(ui.console.println);
          ui.console.after(delayedUpdate(ui,ctx,{state:"combat"}));
        }
      },
      "move":{
        "prompt":["You have chosen to move.",
                  "${turn.name} can move up to ${turn.movement} feet (${turn.movement/5} spaces).",
                  "Where would you like to move?",
                  "Choose where to move by entering the coordinates of the space to move to,",
                  "letter then number, no separator."],
        "opts":function(ui,ctx) {
          ui.map.drawWithOpenSpaces();
        },
        "input":function(ui,ctx,value){
          var open = ui.map.openWithinRangeOfHero();
          if (open.indexOf(value) < 0) {
            throw "'" + value + "' is occupied or out of range."
          }
          return {state:"moveTo",dest:value};
        }
      },
      "moveTo":{
        "prompt":["You have chosen to move to ${dest}."],
        "auto":function(ui,ctx){
          ui.map.moveCharacter(ctx.turn.mapListing,ctx.dest);
          delete ctx.dest;
          ui.map.after(function(){
            ui.console.after(delayedUpdate(ui,ctx,{state:"nextTurn"}));
          });
        }
      },
      "target":{
        "prompt":["You have chosen to attack.",
                  "Choose a foe to attack by entering the letter on the map",
                  "which corresponds to them."],
        "opts":function(ui,ctx) {
          ui.map.drawWithTargets();
        },
        "input":function(ui,ctx,value){
          if ((typeof ctx.foeKeys[value]) == "number") {
            ui.map.draw();
            ui.map.after(delayedUpdate(ui,ctx,{
              state:"attack",
              target:ctx.foes[ctx.foeKeys[value]]
            }));
          } else if (value.length == 1) {
            var index = value.charCodeAt(0) - "a".charCodeAt(0);
            if (index >= 0 && index < ctx.foes.length) {
              throw "Enemy '" + ctx.foes[index].name + "' is already dead."
            }
          } else {
            throw "'" + value + "' is not a valid input. Please choose one of " + Object.keys(ctx.foeKeys) + ".";
          }
        }
      },
      "attack":{
        "prompt":["You have chosen to attack ${target.name}.",
                  "You make ${turn.attack.perTurn} attack${turn.attack.perTurn>1?'s':''} with ${turn.attack.name}.",
                  "Rolling for attack..."],
        "auto":function(ui,ctx) {
          var rollLog = Roller.rollAttacks(ctx.turn.attack.perTurn,ctx.turn.attack.bonus,ctx.target.armor);
          ctx.successes = rollLog.pop();
          var newState = {
            state:attackResult(ctx.successes)
          };
          rollLog.forEach(ui.console.println);
          ui.console.after(delayedUpdate(ui,ctx,newState));
        }
      },
      "hit":{
        "prompt":["${turn.name} hits ${target.name}!"],
        "auto":calcDamage
      },
      "hits":{
        "prompt":["${turn.name} hits ${target.name} ${successes} times!"],
        "auto":calcDamage
      },
      "miss":{
        "prompt":["${turn.name} misses ${target.name}."],
        "auto":{state:"nextTurn"}
      },
      "damage":{
        "prompt":["${target.name} takes a total of ${damage} points of damage."],
        "auto":function(ui,ctx) {
          var nextState = (ctx.target.health <= 0)?"kill":"nextTurn";
          ui.console.after(function() {
            ui.map.draw();
            ui.output.after(delayedUpdate(ui,ctx,{state:nextState}))
          })
        }
      },
      "deadhero":{
        "prompt":["${target.name} is dead!"],
        "auto":function() {
          var order = ctx.order.map(function(o) {return o.mapListing;}).indexOf(ctx.target.mapListing);
          ctx.order.splice(order,1);
          ctx.target.dead = true;
          if (ctx.party.length == ctx.party.filter(function(h) {return h.dead;}).length) {
            return {state:"TPK"};
          } else {
            return {state:"nextTurn"};
          }
        }
      },
      "kill":{
        "prompt":["${target.name} is dead!"],
        "auto":function(ui,ctx) {
          var order = ctx.order.map(function(o) {return o.mapListing;}).indexOf(ctx.target.mapListing);
          ctx.order.splice(order,1);
          delete ctx.target.loc;
          delete ctx.foeKeys[ctx.target.mapListing];
          ui.console.after(function() {
            ui.map.draw()
            ui.map.after(delayedUpdate(ui,ctx,{state:"hdywtdt"}))
          });
        }
      },
      "hdywtdt":{
        "prompt":["How do you want to do this?"],
        "input":function(ui,ctx){
          var nextState = (Object.keys(ctx.foeKeys).length < 1)?"victory":"nextTurn";
          return {state:nextState};
        }
      },
      "nextTurn":{
        "prompt":[],
        "auto":function(ui,ctx){
          delete ctx.damage;
          if (ctx.actions && Object.keys(ctx.actions).length > 2 && ctx.actions["end turn"]) {
            return {state:"combat"};
          }
          delete ctx.actions;
          ctx.order.push(ctx.turn);
          ctx.turn = ctx.order.shift();
          return {state:"turn"};
        }
      },
      "TPK":{
        "prompt":[
          "All the members of your party have died.",
          "You have failed."
        ],
        "auto":{state:"gameover"}
      },
      "victory":{
        "prompt":[
          "The enemies have all been defeated!",
          "You are victorious!"
        ],
        "auto":{state:"gameover"}
      },
      "gameover":{
        "prompt":["GAME OVER"],
        "auto":function(ui,ctx){
          ui.disallowEntry();
        }
      }
    }
  });
})()
