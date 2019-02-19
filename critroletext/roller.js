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
    rollDamage:function(damage,successes) {
      console.log(damage);
      return "?".repeat(successes).split("").reduce(function(sum){
        return sum + Roller.rollExpression(damage);
      }, 0);
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
