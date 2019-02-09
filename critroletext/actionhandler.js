(function() {
  var sizes = ["tiny","small","medium","large","huge","gargantuan"];
  var delayedUpdate = function(ui,ctx) {
    return function(){
      proceed(ui,ctx);
    }
  }
  var resolveUpdate = function(ui,ctx,update,value) {
    if ((typeof update) == "function") {
      try {
        var result = update(ui,ctx,value);
        Template.applyToContext(ctx,result);
      } catch(e) {
        Template.buildTemplatePrinter(ui,ctx)(e.stack);
      }
    } else {
      Template.applyToContext(ctx,update);
    }
  }
  var rollInitiative = function(ctx) {
    return function(member) {
      var result = Roller.roll(20);
      member.order = result + member.initiative;
      ctx.order.push(member);
    }
  }
  var rollForInitiative =
  var calcDamage = function(ui,ctx) {
    var damage = Roller.rollDamage(ctx.turn.damage,ctx.successes);
    ctx.target.health = ctx.target.health - damage;
    delete ctx.successes;
    return {state:"damage",damage:damage};
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
  var interaction = {
    "init":{
      "prompt":[],
      "auto":function(ui,ctx){
        ctx.prologue.forEach(ui.console.println);
        Template.applyToContext(ctx,{state:"start"})
        ui.console.after(delayedUpdate(ui,ctx));
        return {};
      }
    },
    "start":{
      "prompt":["Type 'START' and hit 'ENTER' to begin."],
      "opts":{"START":{state:"initiative"}}
    },
    "initiative":{
      "prompt":["Roll for initiative!"],
      "auto":function(ui,ctx) {
        ctx.order = [];
        ctx.party.forEach(rollInitiative(ctx));
        ctx.party.forEach(function(member) {
          console.log(member.name + " - " + member.order);
        })
        ctx.foes.forEach(rollInitiative(ctx));
        ctx.foes.forEach(function(foe) {
          console.log(foe.name + " - " + foe.order);
        })
        ctx.order.sort(function(a,b){
          return b.order - a.order;
        });
        ctx.order.filter(function(member){
          return member.player == "player";
        }).map(function(member){
          return member.name + " - " + member.order;
        }).forEach(ui.console.println);
        ctx.turn = ctx.order.shift();
        Template.applyToContext(ctx,update,{
          state:"turn"
        });
        ui.console.after(delayedUpdate(ui,ctx));
        console.log("full initiative order");
        ctx.order.forEach(function(member) {
          console.log(member.name + " - " + member.order);
        })
        return {};
      }
    },
    "turn":{
      "prompt":["","It is ${turn.name}'s turn!"],
      "auto":function(ui,ctx) {
        if (ctx.turn.player == "player") {
          ctx.actions = ["Move","Attack","End Turn"]
          return {state:"combat"};
        } else {
          return {state:"npc-combat"};
        }
      }
    },
    "npc-combat":{
      "prompt":[],
      "auto":function(ui,ctx) {
        var npc = ctx.turn;
        var priorities = ctx.party.map(function(m) {
          return {
            attack:m.attack,
            armor:m.armor,
            speed:m.movement,
            size:sizes.indexOf(m.size),
            health:m.health,
            maxHealth:m.maxHealth,
            maxDamage:(Roller.maxExpression(m.damage) * (m.attacksPerTurn?m.attacksPerTurn:1)),
            avgDamage:(Roller.avgExpression(m.damage) * (20 - (npc.armor - m.attack)))
          };
        });
        console.log(priorities)
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
        ctx.successes = Roller.rollAttacks(npc.attacksPerTurn,npc.attack,ctx.target.armor);
        ctx.damage = Roller.rollDamage(npc.damage,ctx.successes);
        var tplPrinter = Template.buildTemplatePrinter(ctx,ui.console)
        var result = "miss";
        if (ctx.successes > 0) {
          if (ctx.successes > 1) {
            result = "hits";
          } else {
            result = "hit";
          }
        }
        ["","It is ${turn.name}'s turn!",
        ("${turn.name} has chosen to move to " + newPos + ".")].forEach(tplPrinter);
        ui.console.after(function(){
          ui.map.moveFoe(npc.mapListing,newPos);
          ui.output.after(function(){
            ["${turn.name} has chosen to attack ${target.name}.",
            "${turn.name} makes ${turn.attacksPerTurn} attack${turn.attacksPerTurn>1?'s':''} with ${turn.attackName}.",
            "Rolling for attack..."].concat(attackResults[result]).forEach(tplPrinter);
            delete ctx.successes;
            delete ctx.damage;
            Template.applyToContext(ctx,{state:"nextTurn"})
            ui.console.after(delayedUpdate(ui,ctx));
          })
        })
        return {};
      }
    },
    "combat":{
      "prompt":["What do you wish to do?","${actions.join(', ')}"],
      "input":function(ui,ctx,value) {
        var index = ctx.actions.indexOf(value);
        if (index < 0) {
          throw "'" + value + "' is not a valid input; must be one of " + ctx.actions.join(", ");
        }
        var option = ctx.actions.splice(index,1);
        var states = {"Move":"move","Attack":"target"};
        var state = states[option];
        if (!state) {state = "nextTurn";}
        return {state:state};
      }
    },
    "move":{
      "prompt":["You have chosen to move.","Where would you like to move?"],
      "input":function(ui,ctx,value){
        var open = ui.map.openWithinRangeOfHero();
        if (open.indexOf(value) < 0) {
          throw "'" + value + "' is occupied or out of range."
        }
        ctx.dest = value;
        return {state:"moveTo"};
      }
    },
    "moveTo":{
      "prompt":["You have chosen to move to ${dest}."],
      "auto":function(ui,ctx){
        ui.console.after(function(){
          ui.map.moveCharacter(ctx.turn.mapListing,ctx.dest);
          delete ctx.dest;
          Template.applyToContext(ctx,{state:"nextTurn"});
          ui.output.after(delayedUpdate(ui,ctx));
        });
        return {};
      }
    },
    "target":{
      "prompt":["You have chosen to attack.","Choose a foe to attack."],
      "input":function(ui,ctx,value){
        var index = value.charCodeAt(0) - "a".charCodeAt(0);
        return {state:"attack",target:ctx.foes[index]};
      }
    },
    "attack":{
      "prompt":["You have chosen to attack ${target.name}.","You make ${turn.attacksPerTurn} attack${turn.attacksPerTurn>1?'s':''} with ${turn.attackName}.","Rolling for attack..."],
      "auto":function(ui,ctx) {
        var successes = Roller.rollAttacks(ctx.turn.attacksPerTurn,ctx.turn.attack,ctx.target.armor);
        if (successes > 0) {
          ctx.successes = successes;
          if (successes > 1) {
            return {state:"hits"}
          } else {
            return {state:"hit"};
          }
        } else {
          return {state:"miss"};
        }
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
      "prompt":["${turn.name} does ${damage} of damage to ${target.name}"],
      "auto":function(ui,ctx) {
        if (ctx.target.health <= 0) {
          return {state:"kill"}
        } else {
          return {state:"nextTurn"};
        }
      }
    },
    "kill":{
      "prompt":["${target.name} is dead!",
                "How do you want to do this?"],
      "input":function() {
        return {state:"nextTurn"};
      }
    },
    "nextTurn":{
      "prompt":[],
      "auto":function(ui,ctx){
        delete ctx.damage;
        if (ctx.actions.length > 1 && ctx.actions.indexOf("End Turn") >= 0) {
          return {state:"combat"};
        }
        ctx.order.push(ctx.turn);
        ctx.turn = ctx.order.shift();
        return {state:"turn"};
      }
    }
  };
  var steps = {
    auto:resolveUpdate,
    roll:function(ui,ctx,rollObj) {
      Template.applyToContext(ctx,
        Roller.rollCheck(parseInt(Template.resolveTemplate(rollObj.bonus,ctx)),
          parseInt(Template.resolveTemplate(rollObj.target,ctx)),
          rollObj.success,
          rollObj.failure));
    },
    input:resolveUpdate,
    opts:function(ui,ctx,opts,opt) {
      var optNames = Object.keys(opts);
      if (optNames.indexOf(opt) >= 0) {
        resolveUpdate(ui,ctx,opts[opt]);
      } else {
        [("'" + opt + "' is not a valid response to the prompt."),
        ("Please type one of '" + optNames.join("','") + "'")].forEach(Template.buildTemplatePrinter(ui,ctx));
      }
    }
  }
  var proceed = function(ui,ctx) {
    var currentState = ctx.state;
    var state = interaction[currentState];
    if (!state) {
      throw ("no state exists: " + currentState);
    }
    state.prompt.forEach(Template.buildTemplatePrinter(ui,ctx));
    var event = ["auto"].filter(function(item) {
      return state[item];
    });
    if (event.length > 1) {
      throw ("Invalid construct of state " + ctx.state + ": multiple events - [" + event.join() + "]");
    } else if (event.length == 1) {
      event = event[0];
      var opts = state[event];
      var step = steps[event];
      step(ui,ctx,opts);
      if (currentState != ctx.state) {
        proceed(ui,ctx);
      }
    }
  };
  var buildTrigger = function(ui,ctx) {
    var publisher = document.createElement("span");
    var trigger = new Trigger(publisher,"transition-to-next-state");
    trigger.subscribe(function() {
      proceed(ui,ctx);
    })
    return function() {
      trigger.fire();
    }
  }
  window.ActionHandlerFactory = function(config) {
    return function(ui) {
      var ctx = {
        map:config.map,
        prologue:config.prologue,
        state:"init",
        party:JSON.parse(JSON.stringify(config.characterSheets)).map(function(member,i){
          member.mapListing = (i + 1) + "";
          member.health = member.maxHealth;
          member.player = "player";
          if (!member.attacksPerTurn) {
            member.attacksPerTurn = 1;
          }
          return member;
        }),
        foes:(function(){
          var monsterMap = config.monsters.reduce(function(out,monster){
            out[monster.type] = monster;
            return out;
          },{});
          return JSON.parse(JSON.stringify(config.foes)).map(function(member,i){
            var base = JSON.parse(JSON.stringify(monsterMap[member.type]));
            base.health = base.maxHealth;
            base.name = member.name;
            base.loc = member.loc;
            base.player = "NPC";
            base.mapListing = String.fromCharCode(i + "a".codePointAt(0));
            return base;
          });
        })()
      };
      ui.map = new RogueLikeMap(ui,ctx);
      this.init = function() {
        ui.map.init();
        ui.output.after(function(){
          proceed(ui,ctx);
        });
      }
      this.handle = function(action) {
        var state = interaction[ctx.state];
        if (!state) {
          throw ("no state exists: " + ctx.state);
        }
        var event = ["opts","input"].filter(function(item) {
          return state[item];
        });
        if (event.length != 1) {
          throw ("Invalid construct of state " + ctx.state + ": multiple events - [" + event.join() + "]");
        }
        event = event[0];
        var opts = state[event];
        var step = steps[event];
        step(ui,ctx,opts,action);
        proceed(ui,ctx);
      }
    }
  }
})();
