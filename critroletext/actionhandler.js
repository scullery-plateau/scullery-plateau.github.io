(function() {
  var roll = function(side,count){
    if (!count){count = 1;}
    return (side + "").repeat(count).reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * b);
    },0);
  }
  var resolveTemplate = function(tpl,state) {
    return eval("`" + tpl.split("${").join("${state.") + "`");
  }
  var interaction = {
    "init":{
      "prompt":["Your adventure starts here....","Type 'START' and hit 'ENTER' to begin."],
      "opts":{"START":{state:"initiative"}}
    },
    "initiative":{
      "prompt":["You are in combat!","It is Vax's turn!"],
      "auto":{state:"combat",turn:"7"}
    },
    "combat":{
      "prompt":["What do you wish to do?","1 - Move","2 - Attack"],
      "opts":{"1":{state:"move"},"2":{state:"target"}}
    },
    "move":{
      "prompt":["You have chosen to move.","Where would you like to move?"],
      "input":function(value){
        map.moveCharacter(ctx.turn,value);
        return {state:"combat"};
      }
    },
    "target":{
      "prompt":["You have chosen to attack.","Choose a foe to attack."],
      "input":function(value){
        return {state:"attack",target:value};
      }
    },
    "attack":{
      "prompt":["You have chosen to attack ${target.name}","Rolling for attack..."],
      "roll":{check:"attack",bonus:8,target:18,
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
      "prompt":["${turn.name} misses ${target.name}."]
    },
    "damage":{
      "prompt":["${turn.name} does ${damage} of damage to ${target.name}"]
    }
  };
  window.ActionHandlerFactory = function(config) {
    return function(ui) {
      var state = {};
      this.init = function() {
        
      }
      this.handle = function(action) {
        
      }
    }
  }
})();