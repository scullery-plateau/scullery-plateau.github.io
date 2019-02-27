(function(){
  var initOutput = "      ABCDEFGHIJ\n     +----------+    \n    1|   cb     |    \n    2|    4     |    \n    3|1 3  5a ^ |    \n    4|\2      /=|    \n    5|~\  /=#=/ |    \n    6|~~==/   6 |    \n    7|~\    7   |    \n    8|~~~~\     |    \n    9|~~~~~~\   |    \n    +----------+    \n\n    1 - Percy    \n    2 - Vex    \n    3 - Keyleth    \n    4 - Scanlan    \n    5 - Grog    \n    6 - Pike    \n    7 - Vax    \n\n    a - Ner\'zhul    \n    b - Vol\'jin    \n    c - Thrall    \n\n     ^ - House     \n     # - Bridge    \n    ~=\/ - Water     ";
  var initConsole = "\nThe Adventures Of Vox Machina: Chapter Zero - On The Road To Kraghammer\n\nUpon reuniting at the newly-constructed Greyskull Keep, the much celebrated\nheroes of Emon, Vox Machina, are hired by their good friend Arcanist Allura\nVysoren of the Tal\'Dorei council to aid her dear friend, Lady Kima of Vord,\npaladin of Bahamut The Platinum Dragon, in her vision quest which has taken\nher to the subterranean Dwarvish city of Kraghammer days prior.\n\nHowever, our heroes, on the road to Kraghammer, find themselves somewhat worse\nfor wear after a less than ideal family reunion for our goliath barbarian,\ndown one Dragonborn Sorcerer, and ambushed by an Orcish war council...\n\nType \'START\' and hit \'ENTER\' to begin.\nRoll for initiative!\nPercy - 16\nVex - 15\nPike - 15\nGrog - 11\nKeyleth - 9\nVax - 6\nScanlan - 4\n\nIt is Percy\'s turn!\nWhat do you wish to do?\nMove, Attack, End Turn\nYou have chosen to attack.\nChoose a foe to attack.\nYou have chosen to attack Vol\'jin.\nYou make 3 attacks with Pepperbox.\nRolling for attack...\nPercy hits Vol\'jin 2 times!\nPercy does 30 of damage to Vol\'jin\nWhat do you wish to do?\nMove, End Turn\n\nIt is Vex\'s turn!\nWhat do you wish to do?\nMove, Attack, End Turn\nYou have chosen to attack.\nChoose a foe to attack.\nYou have chosen to attack Thrall.\nYou make 2 attacks with Longbow.\nRolling for attack...\nVex hits Thrall!\nVex does 13 of damage to Thrall\nWhat do you wish to do?\nMove, End Turn\n\nIt is Pike\'s turn!\nWhat do you wish to do?\nMove, Attack, End Turn\nYou have chosen to move.\nWhere would you like to move?\nYou have chosen to move to I6.\nWhat do you wish to do?\nAttack, End Turn\nYou have chosen to attack.\nChoose a foe to attack.\nYou have chosen to attack Thrall.\nYou make 1 attack with Mace Of Disruption.\nRolling for attack...\nPike hits Thrall!\nPike does 7 of damage to Thrall\n\nIt is Thrall\'s turn!\nThrall has chosen to move to D1.\nThrall has chosen to attack Scanlan.\nThrall makes 2 attacks with Warpike.\nRolling for attack...\nThrall misses Scanlan.\n\nIt is Vol\'jin\'s turn!\nVol\'jin has chosen to move to E1.\nVol\'jin has chosen to attack Scanlan.\nVol\'jin makes 2 attacks with Warpike.\nRolling for attack...\nVol\'jin misses Scanlan.\n\nIt is Grog\'s turn!\nWhat do you wish to do?\nMove, Attack, End Turn\nYou have chosen to move.\nWhere would you like to move?\nYou have chosen to move to F3.\nWhat do you wish to do?\nAttack, End Turn\nYou have chosen to attack.\nChoose a foe to attack.\nYou have chosen to attack Ner\'zhul.\nYou make 1 attack with Flaming Warhammer.\nRolling for attack...\nGrog hits Ner\'zhul!\nGrog does 17 of damage to Ner\'zhul\n\nIt is Keyleth\'s turn!\nWhat do you wish to do?\nMove, Attack, End Turn\n";
  var mockRandom = function() {
    var values = Array.from(arguments);
    Math.random = function() {
      var value = values.shift();
      values.push(value);
      return value;
    }
    return values;
  }
  var buildMockUI = function(trigger) {
    var data = [];
    return {
      data:data,
      println:function(str) {
        data.push(str);
      },
      clearOutput:function(){
        data.splice(0,data.length);
      },
      after:function(fn) {
        setTimeout(function() {
          fn();
        },10);
      }
    }
  }
  var buildTestPath = function(ui,actionHandler,steps,finalFN) {
    var go = finalFN;
    if (steps.length > 0) {
      go = function() {
        var step = steps.shift();
        console.log(step);
        ui.console.println(step);
        actionHandler.handle(step);
        buildTestPath(actionHandler,steps,finalFN);
      }
    }
    setTimeout(go,700);
  }
  window.allTests = (function(){
    console.log(GameData);
    var ActionHandler = ActionHandlerFactory(GameData,GameStates);
    var mockUI = {
      output:buildMockUI(),
      console:buildMockUI()
    };
    var actionHandler = new ActionHandler(mockUI);
    var mockedRandoms = mockRandom(0.35, 0.45, 0.3, 0.05, 0.4, 0.7, 0, 0.1, 0.6, 0.65, 0.1, 0.85, 0.75, 0.7, 0.95, 0.5, 0.1, 0.7, 0.95, 0.9);
    return {
      "test_init_start":function() {
        actionHandler.init();
        buildTestPath(mockUI,actionHandler,[
          "Start",
          "Attack","b","End Turn", // Percy - 16
          "Attack","c","End Turn", // Vex - 15
          "Move","I6","Attack","c", // Pike - 15
          "Move","F3","Attack","a", // Grog - 11
          "Attack","b","End Turn", // Keyleth - 9
          "Move","H3","Attack","a", // Vax - 6
          "Attack","b","End Turn", // Scanlan - 4
          "Attack","b","End Turn", // Percy - 16
          "Attack","a","End Turn", // Vex - 15
          "Attack","c","End Turn", // Pike - 15
          "Attack","a","End Turn", // Grog - 11
          "Attack","b","End Turn", // Keyleth - 9
          "Attack","c","End Turn", // Vax - 6
          "Attack","a","End Turn", // Scanlan - 4
          "Attack","a","End Turn", // Percy - 16
        ],function(){
          var expectedConsole = mockUI.console.data.join("\n")
          var expectedOutput = mockUI.output.data.join("\n");
          console.log(expectedConsole);
          console.log(expectedOutput);
          assertEquals(expectedOutput,initOutput,"Map output does not match.");
          assertEquals(expectedConsole,initConsole,"Console output does not match.");
        });
      }
    };
  })();
})();
