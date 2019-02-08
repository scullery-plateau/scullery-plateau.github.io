(function() {
  var roll = function(side,count){
    if (!count || isNaN(parseInt(count))) {count = 1;}
    return String.fromCharCode("A".charCodeAt(0) + side).repeat(count).split("").reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * (b.charCodeAt(0) - "A".charCodeAt(0)));
    },0);
  }
  var rollCheck = function(bonus,target,success,failure) {
    return (((roll(20) + bonus) > target) ? success : failure);
  }
  var rollExpression = function(expression) {
    return expression.split("+").reduce(function(sum,d) {
      var values = d.trim().split("d").reverse().map(parseInt);
      if (values.length > 1) {
        return sum + roll.apply(null,values);
      } else {
        return sum + values[0];
      }
    }, 0);
  }
  var resolveTemplate = function(tpl,state) {
    if ((tpl + "").indexOf("${") >= 0) {
      return eval("`" + tpl.split("${").join("${state.") + "`");
    } else {
      return tpl;
    }
  }
  var delayedUpdate = function(ui,ctx,update) {
    return function(){
      applyToContext(ctx,update);
      proceed(ui,ctx);
    }
  }
  var printTpl = function(ui,ctx) {
    return function(line) {
      ui.console.println(resolveTemplate(line,ctx));
    }
  }
  var applyToContext = function(ctx,update) {
    Object.entries(update).forEach(function(entry){
      ctx[entry[0]] = resolveTemplate(entry[1],ctx);
    });
  }
  var resolveUpdate = function(ui,ctx,update,value) {
    if ((typeof update) == "function") {
      try {
        var result = update(ui,ctx,value);
        applyToContext(ctx,result);
      } catch(e) {
        printTpl(ui,ctx)(e);
      }
    } else {
      applyToContext(ctx,update);
    }
  }
  var rollInitiative = function(ctx) {
    return function(member) {
      var result = roll(20);
      member.order = result + member.initiative;
      ctx.order.push(member);
    }
  }
  var rollForInitiative = function(ui,ctx) {
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
    ctx.turn = ctx.order.shift();
    ui.console.after(delayedUpdate(ui,ctx,{
      state:"turn"
    }));
    return {};
  }
  var calcDamage = function(ui,ctx) {
    var damage = "?".repeat(ctx.successes).split("").reduce(function(sum){
      return sum + rollExpression(ctx.turn.damage);
    }, 0);
    ctx.target.health = ctx.target.health - damage;
    delete ctx.successes;
    return {state:"damage",damage:damage};
  }
  var npcTurn = function(ui,ctx) {

  }
  var interaction = {
    "init":{
      "prompt":[],
      "auto":function(ui,ctx){
        ctx.prologue.forEach(ui.console.println);
        ui.console.after(delayedUpdate(ui,ctx,{state:"start"}));
        return {};
      }
    },
    "start":{
      "prompt":["Type 'START' and hit 'ENTER' to begin."],
      "opts":{"START":{state:"initiative"}}
    },
    "initiative":{
      "prompt":["Roll for initiative!"],
      "auto":rollForInitiative
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
    "npc-combat":{"prompt":[],"auto":npcTurn},
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
        if (!state) {state = "nextTurn"}
        return {state:state};
      }
    },
    "move":{
      "prompt":["You have chosen to move.","Where would you like to move?"],
      "input":function(ui,ctx,value){
        ui.console.after(function(){
          map.moveCharacter(ctx.turn,value);
          ui.output.after(delayedUpdate(ui,ctx,{
            state:"nextTurn"
          }));
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
      "prompt":["You have chosen to attack ${target.name}",
      "You make ${turn.attacksPerTurn} attack${turn.attacksPerTurn>1?'s':''} with ${turn.attackName}.",
      "Rolling for attack..."],
      "auto":function(ui,ctx) {
        var successes = "?".repeat(ctx.turn.attacksPerTurn).split("").filter(function(a){
          return roll(20) + ctx.turn.attack > ctx.target.armor;
        }).length;
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
      "auto":{state:"nextTurn"}
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
      applyToContext(ctx,
        rollCheck(parseInt(resolveTemplate(rollObj.bonus,ctx)),
          parseInt(resolveTemplate(rollObj.target,ctx)),
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
        ("Please type one of '" + optNames.join("','") + "'")].forEach(printTpl(ui,ctx));
      }
    }
  }
  var proceed = function(ui,ctx) {
    var currentState = ctx.state;
    var state = interaction[currentState];
    if (!state) {
      throw ("no state exists: " + currentState);
    }
    state.prompt.forEach(printTpl(ui,ctx));
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
  window.ActionHandlerFactory = function(config) {
    return function(ui) {
      var ctx = {
        map:config.map,
        prologue:config.prologue,
        state:"init",
        party:JSON.parse(JSON.stringify(config.characterSheets)).map(function(member){
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
          return JSON.parse(JSON.stringify(config.foes)).map(function(member){
            var base = JSON.parse(JSON.stringify(monsterMap[member.type]));
            base.health = base.maxHealth;
            base.name = member.name;
            base.loc = member.loc;
            base.player = "NPC";
            return base;
          });
        })()
      };
      ui.map = new RogueLikeMap(ui,ctx);
      this.init = function() {
        ui.map.init();
        ui.console.after(function(){
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
