(function(){
  var buildDemoActionHandler = function(config) {
    return function(ui) {
      var map = new RogueLikeMap(ui,config);
      var ctx = {state:"combat"};
      this.init = function() {
        map.init();
        ui.output.after(function(){
          ["Your adventure starts here....",
          "Type 'START' and hit 'ENTER' to begin."
          ].forEach(ui.console.println);
        });
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
      var roll = function(side,count){
        if (!count){count = 1;}
        return (side + "").repeat(count).reduce(function(a,b){
          return a + 1 + Math.floor(Math.random() * b);
        },0);
      }
      this.handle = function(action) {
        console.log(action);
        if (action == "START") {
          var attackRoll = Math.floor(Math.random() * 20) + 1;
          console.log(attackRoll);
          var attackTotal = attackRoll + 8
          var attackLine = attackRoll + " + 8 = " + attackTotal;
          ["You are in combat!",
          "It is Vax's turn!",
          "What do you wish to do?",
          "1 - Move",
          "2 - Attack",
          "1",
          "You have chosen to move.",
          "Where would you like to move?",
          "H3",
          "You have chosen to move to H3."].forEach(ui.console.println);
          ui.console.after(function(){
            map.moveCharacter("7","H3");
            ui.output.after(function(){
              ["What do you wish to do?",
              "1 - Move",
              "2 - Attack",
              "2",
              "You have chosen to attack.",
              "Choose a foe to attack.",
              "a",
              "You have chosen to attack Orc A.",
              "Rolling for attack...",
              attackLine].forEach(ui.console.println);
              if (attackTotal > 18) {
                ["Vax hits Orc A",
                ""].forEach(ui.console.println);
              } else {
                ["Vax misses Orc A."].forEach(ui.console.println);
              }
            });
          });
        }
      }
    };
  };
  window.Game = function(outputId,consoleId,config) {
    var cli = new Interface(0,75,outputId,consoleId,buildDemoActionHandler(config));
    this.init = function() {
      cli.init();
    }
  }
})()
