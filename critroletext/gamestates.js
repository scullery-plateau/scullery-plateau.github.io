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
        [("${turn.name} has chosen to move to " + newPos + ".")].forEach(tplPrinter);
        ui.console.after(function(){
          ui.map.moveFoe(npc.mapListing,newPos);
          ui.output.after(function(){
            ["${turn.name} has chosen to attack ${target.name}.",
            "${turn.name} makes ${turn.attacksPerTurn} attack${turn.attacksPerTurn>1?'s':''} with ${turn.attackName}.",
            "Rolling for attack..."].concat(attackResults[result]).forEach(tplPrinter);
            delete ctx.successes;
            delete ctx.damage;
            ui.console.after(delayedUpdate(ui,ctx,{state:"nextTurn"}));
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
          ui.output.after(delayedUpdate(ui,ctx,{state:"nextTurn"}));
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
        var nextState = (ctx.target.health <= 0)?"kill":"nextTurn";
        ui.map.draw()
        ui.output.after(function(){
          ui.console.after(delayedUpdate(ui,ctx,{state:nextState}))
        })
      }
    },
    "kill":{
      "prompt":["${target.name} is dead!",
                "How do you want to do this?"],
      "input":function() {
        // todo
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
  }
})()
