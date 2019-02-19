(function(){
  var defaultCount = function(count) {
    return (!count || isNaN(parseInt(count))) ? 1 : count;
  }
  var parseExpression = function(expression,applyFn,aggFn,init) {
    return expression.reduce(function(out,d) {
      var values = d.roll.split("d").reverse().map(parseInt);
      return aggFn(out,applyFn(values[0],values[1],d.bonus));
    }, init);
  }
  var add = function(a,b) {return a + b;}
  var roll = function(side,count,bonus){
    count = defaultCount(count);
    bonus = bonus || 0;
    var result = String.fromCharCode("A".charCodeAt(0) + side).repeat(count).split("").reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * (b.charCodeAt(0) - "A".charCodeAt(0)));
    },bonus);
    console.log([side,count,bonus,result]);
    return result;
  }
  var formatDamages = function(results) {
    return Object.entries(results).reduce(function(out,entry) {
      out.push(entry[1] + " points of " + entry[0] + " damage");
      return out;
    },[]);
  }
  var resistanceFunctions = {
    resistances:function(value) {
      return value / 2;
    },
    vulnerabilities:function(value) {
      return value * 2;
    },
    immunitites:function(value) {
      return 0;
    }
  };
  var resolveResistances = function(result,opts) {
    opts = opts || {};
    var resolve = Object.keys(resistanceFunctions).reduce(funtion(sum,key) {
      var types = opts[key] || [];
      if (types.length > 0) {
        var func = resistanceFunctions[key];
        sum += Object.keys(result).reduce(function(total,type) {
          if (types.indexOf(type) > -1) {
            total += func(result[type]);
          }
        },0);
      }
      return sum;
    }, 0);
    return Object.keys(result).filter(function(key){
      return resolve[key] == undefined;
    }).reduce(function(out, key) {
      out += result[key];
      return out;
    }, resolve);
  }
  var roll20 = function(opts) {
    return roll(20);
  }
  window.Roller = {
    roll:roll,
    max:function(side,count,bonus) {
      return (side * defaultCount(count)) + bonus;
    },
    avg:function(side,count,bonus) {
      return ((side + 1) * 0.5 * defaultCount(count)) + bonus;
    },
    rollCheck:function(bonus,target,success,failure,opts) {
      return (((roll20(opts) + bonus) > target) ? success : failure);
    },
    rollAttacks:function(attacksPerTurn,attack,armor,opts) {
      var results = "?".repeat(attacksPerTurn).split("").map(function(){
        var result = roll20(opts);
        var total = result + attack;
        var message = result + "(d20) + " + attack + " = " + total;
        return {message:message,success:(total>armor)};
      });
      var successes = results.filter(function(a){
        return a.success;
      }).length;
      results = results.map(function(a){return a.message});
      results.push(successes);
      return results;
    },
    rollDamage:function(damage,successes,opts) {
      console.log(damage);
      if (successes < 1) {
        return [0];
      }
      var result = "?".repeat(successes-1).split("").reduce(function(results){
        var singleResult = Roller.rollExpression(damage);
        Object.keys(results).forEach(function(key) {
          results[key] = singleResult[key];
        });
        return results;
      }, Roller.rollExpression(damage));
      var logs = formatDamages(result);
      logs.push(resolveResistances(result,opts));
      return logs;
    },
    rollExpression:function(expression) {
      return parseExpression(expression,this.roll,add,0)
    },
    maxExpression:function(expression) {
      return parseExpression(expression,this.max,add,0)
    },
    avgExpression:function(expression) {
      return parseExpression(expression,this.avg,add,0)
    }
  }
})()
