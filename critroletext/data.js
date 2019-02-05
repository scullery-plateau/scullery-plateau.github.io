(function(){
  window.GameData = {
    characterSheets:[{
      name:"Vax",
      attack:8,
      damage:"4d6 + 3",
      armor:19,
      movement:45,
      initiative:4,
      size:"medium",
      maxHealth:66
    },{
      name:"Percy",
      attack:5,
      range:[80,160],
      attacksPerTurn:3,
      damage:"d12 + 5",
      armor:17,
      movement:30,
      initiative:4,
      size:"medium",
      maxHealth:58
    }],
    monsters:[{
      type:"Orc",
      maxHealth:77,
      size:"medium",
      attack:7,
      attacksPerTurn:2,
      damage:"d10 + 6",
      armor:18,
      movement:30,
      initiative:3
    }]
  };
})();
