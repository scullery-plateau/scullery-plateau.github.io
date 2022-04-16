(function(){
  registry.apply("GameData",[],function(){
    return  {
      map:{
        tabSize:4,
        rows:[
          "...............",
          "...............",
          "...............",
          "...............",
          "........^......",
          "\\......./======",
          "~\\../=#=/......",
          "~~==/..........",
          "~\\.............",
          "~~~~\\..........",
          "~~~~~~\\........"
        ],
        legend:{
          ".":"Open Space",
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
        attack:{
          name:"Pepperbox",
          bonus:12,
          range:[80,160],
          perTurn:3,
          damage:[{
            roll:"d10",
            bonus:6,
            type:"piercing"
          }]
        },
        armor:18,
        movement:30,
        initiative:8,
        size:"medium",
        maxHealth:81,
        loc:"A5"
      },{
        name: "Vex",
        attack:{
          name:"Longbow",
          bonus:13,
          range:[80,160],
          perTurn:2,
          damage:[{
            roll:"d8",
            type:"piercing",
            bonus:7
          }]
        },
        armor:19,
        movement:30,
        initiative:5,
        size:"medium",
        maxHealth:72,
        loc:"B6"
      },{
        name: "Keyleth",
        attack:{
          name:"Thorn Whip",
          bonus:10,
          range:[30],
          damage:[{
            type:"piercing",
            roll:"2d6"
          }]
        },
        armor:17,
        movement:30,
        initiative:2,
        size:"medium",
        maxHealth:71,
        loc:"C5"
      },{
        name: "Scanlan",
        attack:{
          name:"Bigby's Hand",
          bonus:10,
          range:[30],
          damage:[{
            type:"force",
            roll:"4d8"
          }]
        },
        armor:17,
        movement:25,
        initiative:2,
        size:"medium",
        maxHealth:59,
        loc:"E4"
      },{
        name: "Grog",
        attack:{
          name:"Flaming Warhammer",
          bonus:9,
          damage:[{
            type:"bludgeoning",
            roll:"d10",
            bonus:8
          },{
            type:"fire",
            roll:"d6"
          }]
        },
        armor:19,
        movement:50,
        initiative:2,
        size:"medium",
        maxHealth:134,
        loc:"E6"
      },{
        name: "Pike",
        attack:{
          name:"Mace Of Disruption",
          bonus:5,
          damage:[{
            type:"bludgeoning",
            roll:"2d6",
            bonus:1
          }]
        },
        armor:20,
        movement:25,
        initiative:0,
        size:"medium",
        maxHealth:73,
        loc:"J9"
      },{
        name:"Vax",
        attack:{
          name:"Dagger/Dagger/Dagger",
          bonus:8,
          perTurn:3,
          damage:[{
            type:"slashing",
            roll:"1d4",
            bonus:6
          }]
        },
        armor:17,
        movement:30,
        initiative:5,
        size:"medium",
        maxHealth:66,
        loc:"G9"
      }],
      foes:[{
        name:"Ner'zhul",
        type:"Orc War Chief",
        loc:"J4"
      },{
        name:"Vol'jin",
        type:"Orc War Chief",
        loc:"F4"
      },{
        name:"Thrall",
        type:"Orc War Chief",
        loc:"J8"
      },{
        name:"Xaakt",
        type:"Orc War Chief",
        loc:"K11"
      },{
        name:"Paghorim",
        type:"Orc War Chief",
        loc:"E2"
      }],
      monsters:[{
        type:"Orc War Chief",
        maxHealth:93,
        size:"medium",
        attack:{
          name:"Warpike",
          bonus:6,
          perTurn:2,
          damage:[{
            type:"bludgeoning",
            roll:"2d8",
            bonus:4
          }]
        },
        armor:16,
        movement:60,
        initiative:1,
        strategy:"distance, armor, health"
      }],
      "conditions":[{
        name:"Prone"
      }],
    };
  });
})();
