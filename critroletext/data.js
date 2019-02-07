(function(){
  window.GameData = {
    map:{
      tabSize:4,
      rows:[
        "          ",
        "          ",
        "        ^ ",
        "\\       /=",
        "~\\  /=#=/ ",
        "~~==/     ",
        "~\\        ",
        "~~~~\\     ",
        "~~~~~~\\   "
      ],
      legend:{
        "^":"House",
        "#":"Bridge",
        "~=\\/":"Water"
      },
    },
    prologue:[
      "",
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
      ""
    ],
    characterSheets:[{
      name:"Percy",
      attackName:"Pepperbox",
      attack:12,
      range:[80,160],
      attacksPerTurn:3,
      damage:"d10 + 6",
      armor:18,
      movement:30,
      initiative:8,
      size:"medium",
      maxHealth:81,
      loc:"A3"
    },{
      name: "Vex",
      attackName:"Longbow",
      attack:13,
      range:[80,160],
      attacksPerTurn:2,
      damage:"d8 + 7",
      armor:19,
      movement:30,
      initiative:5,
      size:"medium",
      maxHealth:72,
      loc:"B4"
    },{
      name: "Keyleth",
      attackName:"Thorn Whip",
      attack:10,
      range:[30],
      damage:"2d6",
      armor:17,
      movement:30,
      initiative:2,
      size:"medium",
      maxHealth:71,
      loc:"C3"
    },{
      name: "Scanlan",
      attackName:"Bigby's Hand",
      attack:10,
      range:[30],
      damage:"4d8",
      armor:17,
      movement:25,
      initiative:2,
      size:"medium",
      maxHealth:59,
      loc:"E2"
    },{
      name: "Grog",
      attackName:"Flaming Warhammer",
      attack:9,
      damage:"d10 + 8 + d6",
      armor:19,
      movement:50,
      initiative:2,
      size:"medium",
      maxHealth:134,
      loc:"E4"
    },{
      name: "Pike",
      attackName:"Mace Of Disruption",
      attack:5,
      damage:"2d6 + 1",
      armor:20,
      movement:25,
      initiative:0,
      size:"medium",
      maxHealth:73,
      loc:"H6"
    },{
      name:"Vax",
      attackName:"Dagger/Dagger/Dagger",
      attack:8,
      attacksPerTurn:3,
      damage:"1d4 + 6",
      armor:17,
      movement:30,
      initiative:5,
      size:"medium",
      maxHealth:66,
      loc:"G7"
    }],
    foes:[{
      name:"Ner'zhul",
      type:"Orc War Chief",
      loc:"G3"
    },{
      name:"Vol'jin",
      type:"Orc War Chief",
      loc:"F2"
    },{
      name:"Thrall",
      type:"Orc War Chief",
      loc:"J6"
    }],
    monsters:[{
      type:"Orc War Chief",
      maxHealth:93,
      size:"medium",
      attack:6,
      attacksPerTurn:2,
      damage:"2d8 + 4",
      armor:16,
      movement:60,
      initiative:1
    }]
  };
})();
