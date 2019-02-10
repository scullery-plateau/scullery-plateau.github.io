(function(){
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
  window.GameStates = {
    "init":{
      "prompt":[],
      "auto":function(ui,ctx){
        ctx.prologue.forEach(ui.console.println);
        ui.console.after(delayedUpdate(ui,ctx,{state:"start"}));
        return {};
      }
    },
    "start":{
      "prompt":["Type 'Start' and hit 'ENTER' to begin."],
      "opts":{"Start":{state:"initiative"}}
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
        ui.console.after(delayedUpdate(ui,ctx,{state:"turn"}));
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
          if (ctx.turn.deathsaves) {
            return {state:"deathsaves"};
          } else if (ctx.turn.unconscious) {
            return {state:"unconscious"}
          } else {
            ctx.actions = ["Move","Attack","End Turn"]
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
      "auto":function() {
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
        [("${turn.name} has chosen to move to " + newPos + ".")].forEach(tplPrinter);
        var afterMap = ["${turn.name} has chosen to attack ${target.name}.",
        "${turn.name} makes ${turn.attacksPerTurn} attack${turn.attacksPerTurn>1?'s':''} with ${turn.attackName}.",
        "Rolling for attack..."].concat(attackResults[result]);
        ctx.target.health = ctx.target.health - ctx.damage;
        var update = {state:"nextTurn"};
        if (ctx.target.health < 0) {
          if (Math.abs(ctx.target.health) > ctx.target.maxHealth) {
            update.state = "deadhero";
          } else {
            ctx.target.deathsaves = {"success":0,"fail":0};
          }
        }
        ui.console.after(function(){
          ui.map.moveFoe(npc.mapListing,newPos);
          ui.map.after(function(){
            afterMap.forEach(tplPrinter);
            delete ctx.successes;
            delete ctx.damage;
            ui.console.after(delayedUpdate(ui,ctx,update));
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
      "prompt":["You have chosen to move.",
                "${turn.name} can move up to ${turn.movement} feet (${turn.movement/5} spaces).",
                "Where would you like to move?",
                "Choose where to move by entering the coordinates of the space to move to,",
                "letter then number, no separator."],
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
          ui.map.after(delayedUpdate(ui,ctx,{state:"nextTurn"}));
        });
        return {};
      }
    },
    "target":{
      "prompt":["You have chosen to attack.",
                "Choose a foe to attack by entering the letter on the map",
                "which corresponds to them."],
      "input":function(ui,ctx,value){
        console.log(ctx.foeKeys);
        if ((typeof ctx.foeKeys[value]) == "number") {
          return {state:"attack",target:ctx.foes[ctx.foeKeys[value]]};
        }
        if (value.length == 1) {
          var index = value.charCodeAt(0) - "a".charCodeAt(0);
          if (index >= 0 && index < ctx.foes.length) {
            throw "Enemy '" + ctx.foes[index].name + "' is already dead."
          }
        }
        throw "'" + value + "' is not a valid input. Please choose one of " + Object.keys(ctx.foeKeys) + ".";
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
        var nextState = (ctx.target.health <= 0)?"kill":"nextTurn";
        ui.console.after(function() {
          ui.map.draw()
          ui.map.after(delayedUpdate(ui,ctx,{state:nextState}))
        })
        return {};
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
      "prompt":["${target.name} is dead!",
                "How do you want to do this?"],
      "input":function(ui,ctx) {
        var order = ctx.order.map(function(o) {return o.mapListing;}).indexOf(ctx.target.mapListing);
        ctx.order.splice(order,1);
        delete ctx.foeKeys[ctx.target.mapListing];
        if (Object.keys(foeKeys).length < 1)
        var nextState = (Object.keys(foeKeys).length < 1)?"victory":"nextTurn";
        ui.console.after(function() {
          ui.map.draw()
          ui.map.after(delayedUpdate(ui,ctx,{state:nextState}))
        })
        return {};
      }
    },
    "nextTurn":{
      "prompt":[],
      "auto":function(ui,ctx){
        delete ctx.damage;
        if (ctx.actions && ctx.actions.length > 1 && ctx.actions.indexOf("End Turn") >= 0) {
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
        return {};
      }
    }
  }
})()
