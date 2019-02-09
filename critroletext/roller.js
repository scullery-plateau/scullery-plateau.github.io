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
  var add = function(a,b) {return a + b;}
  var roll = function(side,count){
    return String.fromCharCode("A".charCodeAt(0) + side).repeat(defaultCount(count)).split("").reduce(function(a,b){
      return a + 1 + Math.floor(Math.random() * (b.charCodeAt(0) - "A".charCodeAt(0)));
    },0);
  }
  window.Roller = {
    roll:roll,
    max:function(side,count) {
      return side * defaultCount(count);
    },
    avg:function(side,count) {
      return (side + 1) * 0.5 * defaultCount(count);
    },
    rollCheck:function(bonus,target,success,failure) {
      return (((roll(20) + bonus) > target) ? success : failure);
    },
    rollAttacks:function(attacksPerTurn,attack,armor) {
      return "?".repeat(attacksPerTurn).split("").filter(function(a){
        return roll(20) + attack > armor;
      }).length;
    },
    rollDamage:function(damage,successes) {
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
