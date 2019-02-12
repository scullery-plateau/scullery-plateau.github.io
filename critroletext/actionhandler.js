(function() {
  var resolveUpdate = function(ui,ctx,update,value) {
    if (value != undefined) {
      ctx.input = value;
    }
    if ((typeof update) == "function") {
      try {
        var result = update(ui,ctx,value);
        Template.applyToContext(ctx,result);
      } catch(e) {
        Template.buildTemplatePrinter(ctx,ui.console)(e);
      }
    } else {
      Template.applyToContext(ctx,update);
    }
    delete ctx.input;
  }
  var proceed = function(ui,ctx,gameStates) {
    var currentState = ctx.state;
    var state = gameStates[currentState];
    if (!state) {
      throw ("no state exists: " + currentState);
    }
    state.prompt.forEach(Template.buildTemplatePrinter(ctx,ui.console));
    if (state.auto) {
      resolveUpdate(ui,ctx,state.auto);
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
        if (!state.input) {
          throw ("Invalid construct of state " + ctx.state + ": not a user input state");
        }
        resolveUpdate(ui,ctx,state.input,action);
        proceed(ui,ctx,gameStates);
      }
    }
  }
})();
