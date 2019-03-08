(function(){
  var sizes = ["tiny","small","medium","large","huge","gargantuan"];
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
  registry.apply("GameRules",["MapMath","Dice"],function(MapMath,Dice){
    return {
      rollForInitiative:function(members) {
        var results = members.forEach(function(member,index) {
          return {
            order:member.rollInitiative(),
            index:index
          };
        });
        results.sort(function(a,b){
          return a.order - b.order;
        });
        return results;
      },
      deathsave:function(target) {
        target.deathsaves = target.deathsaves || {fail:0,success:0};
        var deathsave = {value:target.rollDeathsave()};
        if (deathsave.value == 20) {
          delete target.deathsaves
          target.health = 1;
          deathsave.action = "has regained one point of health!"
        } else if (deathsave.value == 1) {
          target.deathsaves.fail = target.deathsaves.fail + 2;
        } else if (deathsave.values >= 10) {
          target.deathsaves.success = target.deathsaves.success + 2;
        } else {
          target.deathsaves.fail = target.deathsaves.fail + 1;
        }
        deathsave.nextState = "nextTurn";
        if (target.deathsaves.fail >= 3) {
          deathsave.nextState = "deadhero";
          deathsave.action = "was unable to recover!"
          delete target.deathsaves;
        } else if (target.deathsaves.success >= 3) {
          deathsave.action = "has stablized! They are still unconscious, but are no longer dying."
          delete target.deathsaves;
          target.unconscious = true;
        }
        return deathsave;
      }
    };
  });
})();
