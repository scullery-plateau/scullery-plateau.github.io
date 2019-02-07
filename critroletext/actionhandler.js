(function() {
  var roll = function(side,count){
    if (!count){count = 1;}
    return (side + "").repeat(count).reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * b);
    },0);
  }
  var resolveTemplate = function(tpl,state) {
    if ((tpl + "").indexOf("${") >= 0) {
      return eval("`" + tpl.split("${").join("${state.") + "`");
    } else {
      return tpl;
    }
  }
  var rollCheck = function(bonus,target,success,failure) {
    return (((roll(20) + bonus) > target) ? success : failure);
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
      } catch e {
        printTpl(ui,ctx)(e);
      }
    } else {
      applyToContext(ctx,update);
    }
  }
  var rollInitiative = function(ctx) {
    return function(member) {
      member.order = roll(20) + member.initiative;
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
    ctx.turn = ctx.order.shift();
    ctx.order.filter(function(member){
      return member.player == "player";
    }).map(function(member){
      return member.name + " - " + member.order;
    }).forEach(ui.console.println);
    ui.console.after(delayedUpdate(ui,ctx,{
      state:"turn"
    }));
    return {};
  }
  var npcTurn = function(ui,ctx) {

  }
  var interaction = {
    "init":{
      "prompt":["Your adventure starts here....","Type 'START' and hit 'ENTER' to begin."],
      "opts":{"START":{state:"initiative"}}
    },
    "prologue":{
      "prompt":[],
      "auto":function(ui,ctx){
        ctx.prologue.forEach()
        ui.console.after(delayedUpdate(ui,ctx,{state:"initiative"}));
        return {};
      }
    },
    "initiative":{
      "prompt":["Roll for initiative!"],
      "auto":rollForInitiative
    },
    "turn":{
      "prompt":["","It is ${turn.name}'s turn!"],
      "auto":function(ui,ctx) {
        if (ctx.turn.player == "player") {
          return {state:"combat"};
        } else {
          return {state:"npc-combat"};
        }
      }
    },
    "npc-combat":{"prompt":[],"auto":npcTurn},
    "combat":{
      "prompt":["What do you wish to do?","1 - Move","2 - Attack"],
      "opts":{"1":{state:"move"},"2":{state:"target"}}
    },
    "move":{
      "prompt":["You have chosen to move.","Where would you like to move?"],
      "input":function(ui,ctx,value){
        ui.console.after(function(){
          map.moveCharacter(ctx.turn,value);
          ui.output.after(delayedUpdate(ui,ctx,{
            state:"combat"
          }));
        });
        return {};
      }
    },
    "target":{
      "prompt":["You have chosen to attack.","Choose a foe to attack."],
      "input":function(ui,ctx,value){
        return {state:"attack",target:value};
      }
    },
    "attack":{
      "prompt":["You have chosen to attack ${target.name}","Rolling for attack..."],
      "roll":{bonus:"${turn.attack}",target:"${target.armor}",
        success:{state:"hit"},fail:{state:"miss"}}
    },
    "hit":{
      "prompt":["${turn.name} hits ${target.name}"],
      "auto":function() {
        var damage = roll(6,4) + 3;
        return {state:"damage",damage:damage};
      }
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
        ctx.order.push(ctx.turn);
        ctx.turn = ctx.order.shift();
        return {state:"turn"};
      }
    }
  };
  var steps = {
    auto:resolveUpdate,
    roll:function(ui,ctx,roll) {
      applyToContext(ctx,
        rollCheck(parseInt(resolveTemplate(roll.bonus,ctx)),
          parseInt(resolveTemplate(roll.target,ctx)),
          roll.success,
          roll.failure));
    },
    input:resolveUpdate,
    opts:function(ui,ctx,opts,opt) {
      var optNames = Object.keys(opts);
      if (optNames.indexOf(opt) >= 0) {
        resolveUpdate(ui,ctx,opts[opt]);
      } else {
        [("'" + opt + "' is not a valid response to the prompt."),
        ("Please type one of '" + optNames.join("','") + "'")].forEach(printTpl(ui,ctx);
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
    var event = ["auto","roll"].filter(function(item) {
      return [item];
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
        state:"init",
        party:JSON.parse(JSON.stringify(config.characterSheets)).map(function(member){
          member.health = member.maxHealth;
          member.player = "player";
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
        proceed(ui,ctx);
      }
      this.handle = function(action) {
        var state = interaction[ctx.state];
        if (!state) {
          throw ("no state exists: " + ctx.state);
        }
        var event = ["opts","input"].filter(function(item) {
          return [item];
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
