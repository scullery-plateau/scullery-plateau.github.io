(function(){
  var defaultCount = function(count) {
    return (!count || isNaN(parseInt(count))) ? 1 : count;
  }
  var parseExpression = function(expression,applyFn,aggFn,init) {
    return expression.split("+").reduce(function(out,d) {
      var values = d.trim().split("d").reverse().map(parseInt);
      if (values.length > 1) {
        return aggFn(out,applyFn.apply(null,values));
      } else {
        return aggFn(out,values[0]);
      }
    }, init);
  }
  var add = function(a,b) {
    return a + b;
  }
  var roll = function(side,count,bonus){
    count = defaultCount(count);
    bonus = bonus || 0;
    var result = String.fromCharCode("A".charCodeAt(0) + side).repeat(count).split("").reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * (b.charCodeAt(0) - "A".charCodeAt(0)));
    },bonus);
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
    var resolve = Object.keys(resistanceFunctions).reduce(function(sum,key) {
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
  var rollerConfig = function() {
    var state = 0;
    this.applyAdvantage = function() {
      state++;
    }
    this.applyDisadvantage = function() {
      state--;
    }
    this.roll = function() {
      if (state > 0) {
        return Math.max(roll20(),roll20());
      } else if (state < 0) {
        return Math.min(roll20(),roll20());
      } else {
        return roll20();
      }
    }
  }
  var validateConfig = function(config) {
    if (!(config instanceof rollerConfig)) {
      return new rollerConfig();
    }
    return config;
  }
  registry.apply("Roller",[],function(){
    return  {
      buildConfig:function() {
        return new rollerConfig();
      },
      roll:roll,
      max:function(side,count,bonus) {
        return (side * defaultCount(count)) + bonus;
      },
      avg:function(side,count,bonus) {
        return ((side + 1) * 0.5 * defaultCount(count)) + bonus;
      },
      rollCheck:function(bonus,target,success,failure,config) {
        config = validateConfig(config);
        return (((config.roll() + bonus) > target) ? success : failure);
      },
      rollAttacks:function(attacksPerTurn,attack,armor,config) {
        config = validateConfig(config);
        var results = "?".repeat(attacksPerTurn).split("").map(function(){
          var result = config.roll();
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
        if (successes < 1) {
          return [0];
        }
        var result = "?".repeat(successes).split("").reduce(function(results){
          return damage.reduce(function(out,d){
            out[d.type] += (d.roll?Roller.rollExpression(d.roll):0) + (d.bonus||0);
            return out;
          },results);
        },damage.reduce(function(out,d){
          out[d.type] = 0;
          return out;
        },{}));
        var logs = formatDamages(result);
        logs.push(resolveResistances(result,opts));
        return logs;
      },
      maxDamage:function(damage,opts) {
        var result = damage.reduce(function(out,d){
          out[d.type] = (d.roll?Roller.maxExpression(d.roll):0) + (d.bonus||0);
          return out;
        },{});
        return resolveResistances(result,opts);
      },
      avgDamage:function(damage,opts) {
        var result = damage.reduce(function(out,d){
          out[d.type] = (d.roll?Roller.avgExpression(d.roll):0) + (d.bonus||0);
          return out;
        },{});
        return resolveResistances(result,opts);
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
  });
})()
