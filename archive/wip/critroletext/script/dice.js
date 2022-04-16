(function(){
  registry.apply("Dice",[],function(){
    var rollFn = function(sum,sideCount){
      return sum + Math.floor(Math.random() * sideCount) + 1;
    }
    var Dice = function(sideCount,numberOf) {
      numberOf = (!numberOf || isNaN(parseInt(numberOf))) ? 1 : numberOf;
      var dice = new Array(numberOf).fill(sideCount);
      this.roll = function(options) {
        return dice.reduce(rollFn,0);
      }
    }
    var D20 = function() {
      var die = new Dice(20);
      var state = 0;
      this.applyAdvantage = function() {
        state++;
      }
      this.applyDisadvantage = function() {
        state--;
      }
      this.clear = function() {
        state = 0;
      }
      this.roll = function() {
        try {
          if (state > 0) {
            return Math.max(die.roll(),die.roll());
          } else if (state < 0) {
            return Math.min(die.roll(),die.roll());
          } else {
            return roll20();
          }
        } finally {
          state = 0;
        }
      }
    }
    var add = function(a,b) {return a + b;}
    var parse = function(expression) {
      return expression.split("+").reduce(function(out,d) {
        var values = d.trim().split("d").reverse().map(parseInt);
        if (values.length > 1) {
          out.push(new Dice(values[1],values[0]));
        } else {
          out.init += values[0];
        }
        return out;
      }, {init:0,dice:[]});
    }
    var Pool = function(expression) {
      var parsed = parse(expression);
      this.roll = function() {
        return parsed.dice.reduce(function(sum,die){
          return sum + die.roll();
        },parsed.init);
      }
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
    var DamagePool = function(damageMap) {
      var rollMap = Object.entries(damageMap).reduce(function(out,entry){
        out[entry[0]] = new Pool(entry[1]);
        return out;
      },{});
      this.roll = function(options) {
        var rolls = Object.entries(rollMap).reduce(function(out,entry){
          out[entry[0]] = entry[1].roll();
          return out;
        },{});
        return {
          rolls:rolls,
          final:resolveResistances(rolls,options)
        };
      }
    }
    Dice.D20 = D20;
    Dice.Pool = Pool;
    Dice.DamagePool = DamagePool;
    return Dice;
  });
})();
