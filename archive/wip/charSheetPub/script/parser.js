(function(){
  var splitParser = function(delim,fieldIndexes,fieldFnMap) {
    fieldFnMap = fieldFnMap || {};
    return function(text) {
      var queue = text.split(delim);
      var out = {};
      Object.entries(fieldIndexes).forEach(function(entry) {
        var key = entry[0];
        var index = entry[1];
        var fieldFn = fieldFnMap[key];
        var value = queue[index];
        if (fieldFn) {
          value = fieldFn(value);
        }
        out[key] = value;
      });
      return out;
    }
  }
  var objByCountParser = function(delim,objFn) {
    return function(text) {
      var queue = text.split(delim);
      var out = [];
      var count = parseInt(queue.shift());
      while (queue.length > 0) {
        out.push(objFn(queue));
      }
      return out;
    }
  }
  var tableParser = function(delim,rows,cols) {
    return function(text) {
      var queue = text.split(delim);
      var out = {};
      cols.forEach(function(col){
        rows.forEach(function(row) {
          out[row] = out[row] || {};
          out[row][col] = queue.shift();
        });
      });
      return out;
    }
  }
  var nonParser = function(text) {
    return text;
  }
  var listToFields = function(list,obj,fields) {
    fields.forEach(function(field) {
      obj[field] = list.shift();
    })
  }
  var splitBy = function(delim) {
    return function(text) {
      return text.split(delim).filter(function(item) {
        return item.length > 0;
      });
    }
  }
  var parseFeatures = function(text) {
    var list = text.split("\n").filter(function(item) {
      return item.length > 0;
    });
    var headerIndicies = list.map(function(item,index) {
      return {
        text:item,
        index:index
      };
    }).filter(function(item) {
      return !item.text.startsWith(String.fromCharCode(8226));
    }).map(function(item) {
      return item.index;
    });
    var featureLists = [];
    headerIndicies.forEach(function(hIndex,index) {
      var end = headerIndicies[index+1];
      if (end) {
        featureLists.push(list.slice(hIndex,end));
      } else {
        featureLists.push(list.slice(hIndex));
      }
    })
    var features = featureLists.map(function(featureList) {
      var header = featureList.shift();
      var options = featureList.map(function(feature) {
        return feature.substring(2);
      });
      return {
        header:header,
        features:options
      }
    });
    return features;
  }
  registry.apply("CharSheetParser",[
  ],function(){
    var domParser = new DOMParser();
    var splitChars = {"X":8864,".":8865,"-":8863,"*":8226,"n":10};
    var parseFields = {
      "abilityScores":tableParser(String.fromCharCode(8864),[
        "Strength","Dexterity","Constitution",
        "Intelligence","Wisdom","Charisma"
      ],[
        "Score","Save Proficient","Adjustment"
      ]),
      "classData":nonParser,
      "classResource":nonParser,
      "hitDiceList":objByCountParser(String.fromCharCode(8864),function(q) {
        var dice = {};
        listToFields(q,dice,["numberOf","sideCount"]);
        q.shift();
        return dice;
      }),
      "noteList":splitParser(String.fromCharCode(8864),{
        "Features":0,
        "Armor Proficiencies":1,
        "Weapon Proficiencies":2,
        "Other Proficiencies":3,
        "Languages":4,
        "Inventory":5,
        "Class & Level":7,
        "Subrace":8,
        "Background":9,
        "Name":15,
        "Class & Level (1)":16,
        "copper":17,
        "silver":18,
        "electrum":19,
        "gold":20,
        "platinum":21
      },{
        "Features":parseFeatures,
        "Armor Proficiencies":splitBy("\n"),
        "Weapon Proficiencies":splitBy("\n"),
        "Other Proficiencies":splitBy("\n"),
        "Languages":splitBy("\n"),
        "Inventory":splitBy("\n"),
        "copper":parseInt,
        "silver":parseInt,
        "electrum":parseInt,
        "gold":parseInt,
        "platinum":parseInt,
      }),
      "skillInfo":tableParser(String.fromCharCode(8864),[
        "Athletics",
        "Acrobatics","Sleight of Hand","Stealth",

        "Arcana","History","Investigation","Nature","Religion",
        "Animal Handling","Insight","Medicine","Perception","Survival",
        "Deception","Intimidation","Performance","Persuasion",
        "Initiative"
      ],[
        "Proficient","Adjustment","Expertise","Flag 1","Flag 2"
      ]),
      "spellList":nonParser,
      "weaponList":objByCountParser(String.fromCharCode(8864),function(q) {
        var weapon = {};
        listToFields(q,weapon,["type","range","key1","key2","key3","key4","key5","key6","flag1","flag2"]);
        var damageDieCount = parseInt(q.shift());
        weapon.damage = [];
        "_".repeat(damageDieCount).split("").forEach(function() {
          var die = {};
          listToFields(q,die,["numberOf","sideCount"]);
          weapon.damage.push(die);
        })
        return weapon;
      })
    };
    return function() {
      this.parse = function(fileText) {
        var dom = domParser.parseFromString(fileText,"text/xml");
        return Array.from(dom.children[0].children).reduce(function(out,child){
          var key = child.tagName;
          var value = child.innerHTML;
          var fieldFn = parseFields[key];
          if (fieldFn) {
            value = fieldFn(value);
          }
          out[key] = value;
          return out;
        },{});
      }
    }
  });
})();
