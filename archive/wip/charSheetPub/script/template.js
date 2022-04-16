(function(){
  var dice = function(diceList) {
    return diceList.map(function(die) {
      return `${die.numberOf}d${die.sideCount}`;
    }).join(", ");
  }
  var skill = function(s) {
    return `
<li>${s.skill}: ${s.bonus}</li>`;
  }
  var ability = function(a) {
    return `
<li>
  <p>${a.ability}: ${a.score} (${a.modifier}), Save: ${a.save}</p>
  <ul>${a.skills.map(skill).join('')}</ul>
</li>`;
  }
  registry.apply("CharSheetTemplate",[
  ],function(){
    return function() {
      this.applyTemplate = function(char) {
        return `
<table><tr><td>
  <h3>${char.Name}</h3>
  <hr/>
  <p><b>Armor Class</b> ${char.armorBonus}</p>
  <p><b>Hit Points</b> ${char.currentHealth} (<b>Hit Dice</b> ${dice(char.hitDiceList)})</p>
  <p><b>Speed</b> ${char.baseSpeed} ft.</p>
  <hr/>
  <p>Proficiency Bonus: ${char.proficiencyBonus}</p>
  <ul>${char.abilities.map(ability).join('')}</ul>
  <hr/>

</td></tr><tr><td>
</td></tr></table>
        `;
      }
    }
  });
})();
