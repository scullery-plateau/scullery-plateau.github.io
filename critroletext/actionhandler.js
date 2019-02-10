(function() {
  var resolveUpdate = function(ui,ctx,update,value) {
    if ((typeof update) == "function") {
      try {
        var result = update(ui,ctx,value);
        Template.applyToContext(ctx,result);
      } catch(e) {
        Template.buildTemplatePrinter(ctx,ui.console)(e.stack);
      }
    } else {
      Template.applyToContext(ctx,update);
    }
  }
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
        ("Please type one of '" + optNames.join("','") + "'")].forEach(Template.buildTemplatePrinter(ctx,ui.console));
      }
    }
  }
  var proceed = function(ui,ctx,gameStates) {
    var currentState = ctx.state;
    var state = gameStates[currentState];
    if (!state) {
      throw ("no state exists: " + currentState);
    }
    state.prompt.forEach(Template.buildTemplatePrinter(ctx,ui.console));
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
        proceed(ui,ctx,gameStates);
      }
    }
  };
  var buildFoes = function(config){
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
  }
  window.ActionHandlerFactory = function(config,gameStates) {
    return function(ui) {
      var foes = buildFoes(config);
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
        foes:foes,
        foeKeys:foes.reduce(function(out,f,i){
          out[f.mapListing] = i;
          return out;
        },{})
      };
      ctx.trigger = new Trigger("transition-to-next-state");
      ctx.trigger.subscribe(function(update) {
          Template.applyToContext(ctx,update);
          proceed(ui,ctx,gameStates);
      });
      ui.map = new RogueLikeMap(ui,ctx);
      this.init = function() {
        ui.map.init();
        ui.output.after(function(){
          proceed(ui,ctx,gameStates);
        });
      }
      this.handle = function(action) {
        var state = gameStates[ctx.state];
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
        proceed(ui,ctx,gameStates);
      }
    }
  }
})();
