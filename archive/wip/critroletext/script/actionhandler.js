(function() {
  registry.apply("ActionHandlerFactory",["Template","RogueLikeMap","Trigger","GameRules"],function(Template,RogueLikeMap,Trigger,GameRules){
    var resolveUpdate = function(ui,ctx,update,value) {
      if (value != undefined) {
        ctx.input = value;
      }
      if ((typeof update) == "function") {
        try {
          var result = update(ui,ctx,value);
          if (result) {
            ctx.trigger.fire(result);
          }
        } catch(e) {
          console.error(e);
          Template.buildTemplatePrinter(ctx,ui.console)(e);
        }
      } else {
        ctx.trigger.fire(update);
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
      } else if (state.opts) {
        var options = state.opts;
        if ((typeof options) == "function") {
          options = options(ui,ctx);
        }
        ui.buildOptionsList(options);
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
    return  function(config,gameStates) {
      return function(ui) {
        var foes = buildFoes(config);
        var ctx = {
          map:config.map,
          prologue:config.prologue,
          party:JSON.parse(JSON.stringify(config.characterSheets)).map(function(member,i){
            member.mapListing = (i + 1) + "";
            member.health = member.maxHealth;
            member.player = "player";
            if (!member.attack.perTurn) {
              member.attack.perTurn = 1;
            }
            return member;
          }),
          foes:foes,
          foeKeys:foes.reduce(function(out,f,i){
            out[f.mapListing] = i;
            return out;
          },{}),
          state:"init"
        };
        ctx.trigger = new Trigger("transition-to-next-state");
        ctx.trigger.subscribe(function(update) {
          Template.applyToContext(ctx,update);
          proceed(ui,ctx,gameStates);
        });
        ui.map = new RogueLikeMap(ui,ctx);
        this.init = function() {
          ctx.trigger.fire({});
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
        }
      }
    }
  })
})();
