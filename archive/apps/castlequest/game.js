(function() {
  var storage = {};
  var data = {
    newgames: {
      "Arthur": {
        NAME: "King Arthur",
        MAGIK: 40,
        HP: 145,
        SPEED: 20,
        AP: 14
      },
      "Merlin": {
        NAME: "Merlin",
        MAGIK: 250,
        HP: 140,
        SPEED: 20,
        AP: 8
      },
      "Gawain": {
        NAME: "Gawain",
        MAGIK: 10,
        HP: 180,
        SPEED: 15,
        AP: 10
      },
      "Lancelot": {
        NAME: "Lancelot",
        MAGIK: 10,
        HP: 150,
        SPEED: 15,
        AP: 12
      }
    },
    monsters: {
      BLOB: {
        NAME: "Blob",
        HP: 5,
        MAGIK: 0,
        SPEED: 2,
        AP: 3
      },
      GHOST: {
        NAME: "Ghost",
        HP: 20,
        MAGIK: 10,
        SPEED: 10,
        AP: 15
      },
      GOBLIN: {
        NAME: "Goblin",
        HP: 15,
        MAGIK: 0,
        SPEED: 15,
        AP: 10
      },
      ORC: {
        NAME: "Orc",
        HP: 30,
        MAGIK: 20,
        SPEED: 5,
        AP: 10
      },
      SHA: {
        NAME: "Black Knight",
        HP: 45,
        MAGIK: 20,
        SPEED: 10,
        AP: 30
      },
      SKU: {
        NAME: "Demon's head",
        HP: 80,
        MAGIK: 25,
        SPEED: 30,
        AP: 50
      },
      SOR: {
        NAME: "Sorcerer",
        HP: 100,
        MAGIK: 200,
        SPEED: 25,
        AP: 35
      },
      DRAG: {
        NAME: "Dragon",
        HP: 90,
        MAGIK: 100,
        SPEED: 35,
        AP: 30
      }
    },
    itemEffect: {
      "Magic vial": { MAGIK: 5 },
      "Magic potion": { MAGIK: 20 },
      "Healing herb": { HP: 5 },
      "Healing potion": { HP: 20 }
    },
    spellEffects: {
      Heal: {
        cost: 5,
        effect: {
          self: {
            HP: 5
          }
        }
      },
      Healmore: {
        cost: 20,
        effect: {
          self: {
            HP: 20
          }
        }
      },
      Hurt: {
        cost: 5,
        effect: {
          enemy: {
            HP: -5
          }
        }
      },
      Hurtmore: {
        cost: 20,
        effect: {
          enemy: {
            HP: -20
          }
        }
      },
      Teleport: {
        cost: 15,
        effect: {
          state: {
            D: function() {
              return 1 + Math.floor(state.DMAX * Math.random());
            }
          }
        }
      },
    }
  }
  window.Game = function(ti85) {
    var state = new Object();
    var init = function(){
      state.merge({
          IT1: " ",
          IT2: " ",
          IT3: " ",
          IT4: " ",
          DMAX: 40,
          L: 1
        });
      ti85.dimCanvas(-90,90,-90,90);
      ti85.RcPic("TITLE");
      ti85.Menu({"New":CAS1,"Load":LG1,"Quit":END5})
    };
    var LG1 = function() {
      if (Object.keys(storage).length == 0) {
        ti85.Disp("No games to load.");
        CAS1();
      } else {
        ti85.Disp("LOADGAME");
        var menu = {};
        Object.keys(storage).forEach(function(key){
          ti85.Disp(key);
          menu[key] = LG2(storage[key]);
        });
        ti85.Menu(menu, CAS2);
      }
    }
    var LG2 = function(loadData) {
      return function() {
        state.copyData(loadData);
      }
    }
    var CAS1 = function() {
      state.merge({
        D:1,
        RM:29
      });
      ti85.RcPic("KNIGHT1");
      var menu = {};
      Object.keys(data.newgames).forEach(function(key) {
        menu[key] = CNEW(data.newgames[key]);
      });
      ti85.Menu(menu, CAS2);
    }
    var CNEW = function(newData) {
      return function() {
        state.Player = newData;
      }
    }
    var CAS2 = function() {
      ti85.Line(-90, 90, 90, 90);
      ti85.Line(90, 90, 90, -90);
      ti85.Line(90, -90, -90, -90);
      ti85.Line(-90, -90, -90, 90);
      ti85.Line(-90, 90, -60, 60);
      ti85.Line(-60, 60, 60, 60);
      ti85.Line(90, 90, 60, 60);
      ti85.Line(60, 60, 60, -60);
      ti85.Line(90, -90, 60, -60);
      ti85.Line(60, -60, -60, -60);
      ti85.Line(-90, -90, -60, -60);
      ti85.Line(-60, -60, -60, 60);
      ti85.Line(-60, 60, -30, 30);
      ti85.Line(-60, 30, 60, 30);
      ti85.Line(60, 60, 30, 30);
      ti85.Line(30, 30, 30, -30);
      ti85.Line(60, -60, 30, -30);
      ti85.Line(60, -30, -60, -30);
      ti85.Line(-60, -60, -30, -30);
      ti85.Line(-30, -30, -30, 30);
      ti85.Line(-30, 30, -10, 10);
      ti85.Line(-10, 10, 10, 10);
      ti85.Line(30, 30, 10, 10);
      ti85.Line(10, 10, 10, -10);
      ti85.Line(30, -30, 10, -10);
      ti85.Line(10, -10, -10, -10);
      ti85.Line(-30, -30, -10, -10);
      ti85.Line(-10, -10, -10, 10);
      ti85.Line(-10, -10, 10, 10);
      ti85.Line(-10, 10, 10, -10);
      ti85.Line(10, 0, -10, 0);
      if (state.D < Math.floor(1 + ((4 - state.L) * state.DMAX / 4))) {
        state.RM = 29;
      }
      if (state.D >= Math.floor(1 + ((4 - state.L) * state.DMAX / 4))) {
        state.RM = 39;
      }
      if (state.D < state.DMAX) {
        state.RM = 49;
      }
      state.M = 1;
      state.I = 1;
      ti85.Menu({
        "Go":PRO1,
        "Stat":STATS,
        "Spells":SPELL,
        "Inventory":INVENT,
        "Quit":END2});
    }
    var PRO1 = function() {
      var directions = {
        Left:2,
        Forward:1,
        Right:3,
      }
      var ignore = Math.floor(1 + 4 * Math.random());
      state.ML = 0;
      var menu = {};
      Object.keys(directions).forEach(function(key) {
        var offset = directions[key];
        if (offset != ignore) {
          menu[key] = MONAD(offset);
        }
      })
      ti85.Menu(menu);
    };
    var MONAD = function(offset) {
      return function() {
        state.RDM = offset + 3 * Math.floor(Math.floor(Math.random() * state.RM) / 3);
        MON4();
      }
    }
    var MON4 = function() {
      ((state.RDM <= 3)?MON6:((state.RDM <= 10)?MONI:MONM))();
    };
    var MONI = function() {
      if (state.RDM >= 3 && state.RDM <= 5) { state.TXT1 = "Healing herb"; }
      if (state.RDM == 6 || state.RDM == 7) { state.TXT1 = "Magic Vial"; }
      if (state.RDM == 8 || state.RDM == 9) { state.TXT1 = "Healing potion"; }
      if (state.RDM == 10) { state.TXT1 = "Magic potion"; }
      if (state.RDM <= 7) {
        state.TXT2 = "You've found a " + state.TXT1 + ".";
      } else {
        state.TXT2 = "You've found " + state.TXT1 + ".";
      }
      INVENT4();
    };
    var INVENT4 = function() {
      ti85.Disp(state.TXT2);
      ti85.Menu({
        "Take": TAK,
        "Inventory": INVENT,
        "Go": MON6
      });
    };
    var TAK = function() {
      if (state.IT1 == " ") {
        state.IT1 = state.TXT1;
      } else if (state.IT2 == " ") {
        state.IT2 = state.TXT1;
      } else if (state.IT3 == " ") {
        state.IT3 = state.TXT1;
      } else if (state.IT4 == " ") {
        state.IT4 = state.TXT1;
      } else {
        ti85.Disp("You have no room.");
      }
      MON6();
    };
    var loadMonster = function(key) {
      ti85.RcPic(key);
      state.Monster = new Object();
      state.Monster.merge(data.monsters[key]);
    }
    var MONM = function() {
      state.M = 2;
      if (state.RDM >= 11 && state.RDM <= 17) {
        loadMonster("BLOB");
      } else if (state.RDM >= 18 && state.RDM <= 23) {
        loadMonster("GHOST");
      } else if (state.RDM >= 24 && state.RDM <= 29) {
        loadMonster("GOBLIN");
      } else if (state.RDM >= 30 && state.RDM <= 34) {
        loadMonster("ORC");
      } else if (state.RDM >= 35 && state.RDM <= 39) {
        loadMonster("SHA");
      } else if (state.RDM >= 40) {
        state.ML = 1;
        if (state.L == 1) {
          loadMonster("SKU");
        } else if (state.L == 3) {
          loadMonster("SOR");
        } else if (state.L == 2) {
          loadMonster("DRAG");
        }
      }
      state.merge({
        TXT1: "You encounter a " + state.Monster.NAME + ".",
        ODD3: 1 + Math.floor(Math.random() * 100)
      });
      ti85.Disp(state.TXT1);
      state.MM = 1 + Math.floor(Math.random() * 15);
      if (state.MM <= 10) {
        MONB();
      } else {
        ti85.Disp(state.Monster.NAME + " catches you off guard!");
        MONB();
      }
    };
    var MONB = function() {
      ti85.Menu({
        "Attack":MONA,
        "Run":MONR,
        "Inventory":INVENT,
        "Spells":SPELL,
        "Stat":STATS
      });
    };
    var MONA = function() {
      ti85.Disp("You Attack.");
      state.ODD1 = 1 + (state.Player.SPEED / Math.floor(state.Player.SPEED / 10));
      MONMA();
    };
    var MONR = function() {
      ti85.Disp("Run away, coward!");
      MON6();
    };
    var MONMA = function() {
      state.ODD2 = 1 + (state.Monster.SPEED / Math.floor(state.Monster.SPEED / 10));
      var mult = 0;
      if (state.ODD3 > 65) {
        if (state.ODD1 > state.ODD2) {
          ti85.Disp("Excellent shot!");
          mult = 2;
        } else {
          mult = 0;
        }
      } else {
        mult = 1;
      }
      var ap2 = state.Player.AP * mult;
      state.Monster.HP = state.Monster.HP - ap2;
      if (ap2 == 0) {
        ti85.Disp(state.Monster.NAME + " dodges.");
      } else {
        ti85.Disp(state.Monster.NAME + "'s HP down by " + ap2);
      }
      MONMB();
    };
    var MONMAS = function() {
      ti85.Disp("You cast " + state.SPL + ".");
      if (state.SLP == 2) {
        ti85.Disp(state.Monster.NAME + "'s HP down by " + state.AP2);
      }
      MONMB();
    };
    var MONMB = function() {
      if (state.Monster.HP <= 0) {
        MON5();
      } else {
        state.MRA = 1 + Math.floor(((state.Monster.MAGIK <= 5)?15:20) * Math.random());
        ((state.MRA <= 15)?MONMBA:MONMBS)();
      }
    };
    var MONMBA = function() {
      ti85.Disp(state.Monster.NAME + " attacks!");
      var mult = 0;
      if (state.ODD3 < 25) {
        if (state.ODD2 > (state.ODD1 * 2 / 3)) {
          ti85.Disp("You're in trouble.")
          mult = 2;
        } else {
          mult = 0;
        }
      } else {
        mult = 1;
      }
      var ap2 = state.Monster.AP * mult;
      state.Player.HP = state.Player.HP - ap2;
      if (ap2 > 0) {
        ti85.Disp("Your HP is down by " + ap2 + ".");
      } else {
        ti85.Disp("You dodge.");
      }
      MONE();
    };
    var MONMBS = function() {
      state.MS = 1 + Math.floor(((state.Monster.MAGIK >= 20)?40:15) * Math.random());
      if (state.MS <= 5) {
        state.MLP = "Heal";
      } else if (state.MS > 5 && state.MS <= 15) {
        state.MLP = "Hurt";
      } else if (state.MS > 15 && state.MS <= 30) {
        state.MLP = "Hurtmore";
      } else {
        state.MLP = "Healmore";
      }
      ti85.Disp(state.Monster.NAME + " casts " + state.MLP);
      var spell = data.spellEffects[state.MLP];
      state.Monster.MAGIK = state.Monster.MAGIK - spell.cost;
      if (spell.effect.enemy) {
        applySpellEffects(spell.effect.enemy, state.Player, "Your");
      }
      if (spell.effect.self) {
        applySpellEffects(spell.effect.self, state.Monster);
      }
      MONE();
    };
    var MONE = function() {
      if (state.Player.HP <= 0) {
        END4();
      } else {
        MONB();
      }
    };
    var MON5 = function() {
      ti85.Disp(state.Monster.NAME + " is dead.");
      state.merge({
        HP: state.Player.HP + 1 + Math.floor(state.Monster.AP / 3),
        MAGIK: state.Player.MAGIK + 1 + Math.floor(state.Monster.SPEED / 3)
      })
      MON6();
    };
    var MON6 = function() {
      state.D++;
      ((state.ML == 1 && state.Monster.HP <= 0)?END1:CAS2)();
    };
    var STATS = function() {
      ti85.Disp(state.Player.NAME);
      ti85.Disp("Hit points: " + state.Player.HP);
      ti85.Disp("Magic: " + state.Player.MAGIK);
      ti85.Disp("Speed: " + state.Player.SPEED);
      ti85.Disp("Attack points: " + state.Player.AP);
      ((state.M == 1)?CAS2:((state.M == 2)?MONB:SPELL))();
    };
    var SPELL = function() {
      state.SLL = 0;
      ti85.Disp("Magic: ");
      ti85.Disp(state.Player.MAGIK);
      Object.keys(data.spellEffects).forEach(function(name) {
        var spell = data.spellEffects[name];
        ti85.Disp(name + ": " + spell.cost);
      })
      ti85.Menu({
        "Cast":MA1M,
        "Exit":MA5
      });
    };
    var effectTypeFunctions = {
      number: function(effect) {
        return function(value) {
          return effect + value;
        }
      },
      function: function(effect) {
        return function(value) {
          return effect(value);
        }
      }
    }
    var applySpellEffects = function(effects, target, name) {
      Object.keys(effects).forEach(function(field) {
        var effect = effects[field];
        var fn = effectTypeFunctions[typeof effect](effect);
        var prev = target[field];
        target[field] = fn(target[field]);
        var curr = target[field];
        if (name) {
          ti85.Disp(name + " " + field + " has changed from " + prev + " to " + curr + ".");
        }
      });
    }
    var spellEffect = function(name, spell) {
      return function () {
        state.SPL = name;
        state.SLP = 1;
        if ((spell.effect.enemy) && state.M != 2) {
          ti85.Disp("Nothing to hurt.");
          MA5();
        } else {
          if (state.Player.MAGIK < spell.cost) {
            ti85.Disp("Not enough magic.");
            ((state.M == 2)?MONB:MA5)();
          } else {
            state.Player.MAGIK = state.Player.MAGIK - spell.cost;
            if (spell.effect.self) {
              applySpellEffects(spell.effect.self, state.Player, "Your");
            }
            if (spell.effect.enemy) {
              applySpellEffects(spell.effect.enemy, state.Monster, state.Monster.NAME + "'s");
            }
            if (spell.effect.state) {
              applySpellEffects(spell.effect.state, state);
            }
            MA5();
          }
        }
      }
    }
    var MA1M = function() {
      state.SLL = 1;
      var menu = {};
      Object.keys(data.spellEffects).forEach(function(name) {
        var spell = data.spellEffects[name];
        menu[name] = spellEffect(name, spell);
      })
      ti85.Menu(menu);
    };
    var heal = function(label,mark) {
      return function() {
        state.SPL = label;
        state.SLP = 1;
        if (state.Player.MAGIK < mark) {
          ti85.Disp("Not enough magic.");
        } else {
          state.Player.HP = state.Player.HP + mark;
          state.Player.MAGIK = state.Player.MAGIK - mark;
        }
        MA5();
      }
    }
    var hurt = function(label, mark) {
      return function() {
        state.SPL = label;
        state.SLP = 1;
        if (state.M == 2) {
          if (state.Player.MAGIK < mark) {
            ti85.Disp("Not enough magic.");
            MONB();
          } else {
            state.merge({
              SLP: 2,
              AP2: mark,
              MHP: state.Monster.HP - mark,
              MAGIK: state.Player.MAGIK - mark
            })
            MA5();
          }
        } else {
          ti85.Disp("Nothing to hurt.");
          MA5();
        }
      }
    }
    var TL = function() {
      state.merge({
        SPL: "Teleport",
        SLP: 1
      })
      if (state.Player.MAGIK < 15) {
        ti85.Disp("Not enough magic.");
      } else {
        state.merge({
          D: 1 + Math.floor(state.DMAX * Math.random()),
          MAGIK: state.Player.MAGIK - 15
        })
      }
      CAS2();
    }
    var MA5 = function() {
      ((state.M == 1)?CAS2:((state.SLL == 0)?MONB:MONMAS))()
    }
    var INVENT = function() {
      ti85.Disp(state.Player.NAME);
      ti85.Disp("");
      for (var it = 1; it <= 4; it++) {
        var label = "IT" + it;
        if (state[label] != " ") {
          ti85.Disp(state[label]);
        }
      }
      ti85.Menu({
        "Use":INVENT2,
        "Return":INVENT3,
        "Drop":DROP
      });
    };
    var DROPX = function(x) {
      if (x < 4) {
        var nextVal = x + 1;
        var nextDrop = DROPX(nextVal);
        return function() {
          state["IT" + x] = state["IT" + nextVal];
          nextDrop();
        }
      } else {
        return function() {
          state.IT4 = " ";
        }
      }
    }
    var DROP = function() {
      var menu = {"Exit":INVENT};
      for (var x = 1; x <= 4; x++) {
        menu[state["IT" + x]] = DROPX(x);
      }
      ti85.Menu(menu);
    };
    var ITB = function(field,func) {
      return function() {
        var effect = data.itemEffect[state[field]];
        if (effect) {
          Object.keys(effect).forEach(function(key){
            state[key] += effect[key];
          })
        }
        if (state[field] == "Magic vial") {state.Player.MAGIK += 5;}
        if (state[field] == "Magic potion") {state.Player.MAGIK += 20;}
        if (state[field] == "Healing herb") {state.Player.HP += 5;}
        if (state[field] == "Healing potion") {state.Player.HP += 20;}
        func();
      }
    }
    var INVENT2 = function() {
      var menu = {"Exit":INVENT};
      for (var x = 1; x <= 4; x++) {
        var label = "IT" + x;
        menu[state[label]] = ITB(label, DROPX(x));
      }
      ti85.Menu(menu, INVENT);
    };
    var INVENT3 = function() {
      if (state.I == 1 && state.M == 1) {
        CAS2();
      } else if (state.I == 2) {
        INVENT4();
      } else if (state.M == 2) {
        MONB();
      }
    };
    var END1 = function() {
      if (state.L == 3) {
        END3();
      } else {
        ti85.Disp("Wow! You defeated Level " + state.L + "!");
        state.L++;
        ti85.Disp("Now, onto Level " + state.L + ".");
        CAS1();
      }
    };
    var END2 = function() {
      ti85.Disp("SAVEGAME?");
      ti85.Menu({"Yes":SG1A, "No":END5});
    };
    var SG1A = function() {
      ti85.Disp("SAVEGAME");
      var menu = {"New Game":SG2A};
      Object.keys(storage).forEach(function(key) {
        ti85.Disp(key);
        menu[key] = SG1B(key);
      });
      ti85.Menu(menu, END5);
    };
    var save = function(savename) {
      storage[savename] = state.selectKeys(["D", "L", "Player"]);
    }
    var SG2A = function() {
      var savename = ti85.InpST("Enter Filename", "savegame")["savegame"]
      if (savename in storage) {
        ti85.Disp("'" + savename + "' already exists.");
        END2()
      } else {
        save(savename);
      }
    }
    var SG1B = function(savegame) {
      return function() {
        save(savegame);
      }
    }
    var END3 = function() {
      ti85.Disp(" ");
      ti85.Disp(" ");
      state.YDON = "...And the streets will flow with the blood of the non-believers!";
      ti85.Disp(state.YDON);
      END5();
    };
    var END4 = function() {
      ti85.Disp("You are dead.")
      END5();
    };
    var END5 = function() {
      ti85.Disp("GAME OVER");
      init();
    };
    init();
  }
})()
