(function(){
  var initOutput = ["      ABCDEFGHIJ",
  "     +----------+    ",
  "    1|          |    ",
  "    2|    4b    |    ",
  "    3|1 3   a ^ |    ",
  "    4|\\2  5   /=|    ",
  "    5|~\\  /=#=/ |    ",
  "    6|~~==/  6 c|    ",
  "    7|~\\    7   |    ",
  "    8|~~~~\\     |    ",
  "    9|~~~~~~\\   |    ",
  "     +----------+    ",
  "",
  "    1 - Percy    ",
  "    2 - Vex    ",
  "    3 - Keyleth    ",
  "    4 - Scanlan    ",
  "    5 - Grog    ",
  "    6 - Pike    ",
  "    7 - Vax    ",
  "",
  "    a - Ner'zhul    ",
  "    b - Vol'jin    ",
  "    c - Thrall    ",
  "",
  "       ^ - House     ",
  "       # - Bridge    ",
  "    ~=\\/ - Water     "];
  var initConsole = ["",
  "The Adventures Of Vox Machina: Chapter Zero - On The Road To Kraghammer",
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
  "Type 'START' and hit 'ENTER' to begin.",
  "Roll for initiative!",
  "Percy - 25",
  "Grog - 23",
  "Scanlan - 21",
  "Keyleth - 16",
  "Vax - 16",
  "Vex - 14",
  "Pike - 10",
  "",
  "It is Percy's turn!",
  "What do you wish to do?",
  "1 - Move",
  "2 - Attack"
];
  var mockRandom = function() {
    var values = Array.from(arguments);
    Math.random = function() {
      var value = values.shift();
      values.push(value);
      return value;
    }
    return values;
  }
  var buildMockUI = function() {
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
        setTimeout(fn,50);
      }
    }
  }
  var buildTestPath = function(actionHandler,steps,finalFN) {
    var go = finalFN;
    if (steps.length > 0) {
      go = function() {
        actionHandler.handle(steps.shift());
        buildTestPath(actionHandler,steps,finalFN);
      }
    }
    setTimeout(go,200);
  }
  window.allTests = (function(){
    console.log(GameData);
    var ActionHandler = new ActionHandlerFactory(GameData);
    var mockUI = {
      output:buildMockUI(),
      console:buildMockUI()
    }
    var actionHandler = new ActionHandler(mockUI);
    var mockedRandoms = mockRandom(0.8, 0.4, 0.65, 0.9, 1, 0.45, 0.5, 0.35, 0.2, 0.25, 0.95, 0.55, 0.75, 0.15, 0.1, 0.6, 0.85, 0.05, 0.7, 0.3);
    return {
      "test_init_start":function() {
        actionHandler.init();
        buildTestPath(actionHandler,[
          "START","Attack","b","End Turn"
        ],function(){
          console.log(mockUI.output.data);
          console.log(mockUI.console.data);
          assertEquals(JSON.stringify(mockUI.output.data),JSON.stringify(initOutput),"Map output does not match.");
          assertEquals(JSON.stringify(mockUI.console.data),JSON.stringify(initConsole),"Console output does not match.");
        });
      }
    };
  })();
})();
