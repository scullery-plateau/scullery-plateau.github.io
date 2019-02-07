(function(){
  var buildDemoActionHandler = function(config) {
    return function(ui) {
      var map = new RogueLikeMap(ui,config);
      var ctx = {state:"combat"};
      this.init = function() {
        map.init();
        ui.output.after(function(){
          ["The Adventures Of Vox Machina: Chapter Zero - On The Road To Kraghammer",
          "",
          "Upon reuniting at the newly-constructed Greyskull Keep, the much celebrated",
          "heroes of Emon, Vox Machina, are hired by their good friend Arcanist Allura",
          "Vysoren of the Tal'Dorei council to aid her dear friend, Lady Kima of Vord,",
          "paladin of Bahamut The Platinum Dragon, in her vision quest which has taken",
          "her to the subterranean Dwarvish city of Kraghammer days prior.",
          "",
          "However, our heroes, on the road to Kraghammer, find themselves somewhat worse",
          "for wear after a less than ideal family reunion for our goliath barbarian,",
          "down one Dragonborn Sorcerer, and ambushed by an Orcish war council...",
          "",
          "Type 'START' and hit 'ENTER' to begin."
          ].forEach(ui.console.println);
        });
      }
      
      var roll = function(side,count){
        if (!count){count = 1;}
        return (side + "").repeat(count).split("").reduce(function(a,b){
          return a + 1 + Math.floor(Math.random() * b);
        },0);
      }
      this.handle = function(action) {
        console.log(action);
        if (action == "START") {
          var attackRoll = roll(20);
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
