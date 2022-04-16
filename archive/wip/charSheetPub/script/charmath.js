(function(){

  var skills = {
    "Strength":["Athletics"],
    "Dexterity":["Acrobatics","Initiative","Sleight of Hand","Stealth"],
    "Constitution":[],
    "Intelligence":["Arcana","History","Investigation","Nature","Religion"],
    "Wisdom":["Animal Handling","Insight","Medicine","Perception","Survival"],
    "Charisma":["Deception","Intimidation","Performance","Persuasion"]
  }
  var bool = {
    "true":true,
    "false":false
  }
  registry.apply("CharMath",[
  ],function(){
    return function() {
      this.resolve = function(charSheet) {
        charSheet = Object.assign(charSheet,charSheet.noteList);
        delete charSheet.noteList;
        charSheet.totalLevel = charSheet["Class & Level"].split(",").map(function(cl) {
          return cl.trim().split(" ")[1];
        }).reduce(function(a,b) {
          return a + b;
        }, 0);
        charSheet.proficiencyBonus = Math.floor((charSheet.totalLevel-1)/4) + 2;
        charSheet.abilities = Object.entries(skills).reduce(function(out,entry) {
          var ability = entry[0];
          var info = charSheet.abilityScores[ability];
          var score = parseInt(info.Score);
          var modifier = Math.floor((score - 10) / 2);
          var isSave = bool[info["Save Proficient"].toLowerCase()];
          var save = modifier + (isSave?charSheet.proficiencyBonus:0);
          var skills = entry[1].map(function(skill) {
            var skillInfo = charSheet.skillInfo[skill];
            var isProficient = bool[skillInfo.Proficient.toLowerCase()];
            var isExpert = bool[skillInfo.Expertise.toLowerCase()];
            var bonus = modifier + (isProficient?charSheet.proficiencyBonus:0) + (isExpert?charSheet.proficiencyBonus:0);
            return {
              skill:skill,
              bonus:bonus
            }
          });
          return out.concat({
            ability:ability,
            score:score,
            modifier:modifier,
            save:save,
            skills:skills
          })
        },[]);
      }
    }
  });
})();
