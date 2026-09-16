namespace('sp.svengali.buckshot.Context', {}, () => {
  return {
    Data: {
      CARDS: [
        { 
          title: "SAW", 
          icon: "delapouite.chainsaw", 
          description: "Cuts off the end of the gun, making it deal 2 damage.",
          count: 3 
        },
        { 
          title: "BATTERY", 
          icon: "solid.car-battery", 
          description: "Charges the defibrilator; Draw another charge card.", 
          count: 3 
        },
        { 
          title: "MAGNIFIER", 
          icon: "lorc.magnifying-glass", 
          description: "Lets the user view the current shell.", 
          count: 3 
        },
        { 
          title: "SODA", 
          icon: "caro-asercion.soda-bottle", 
          description: "Racks the shotgun revealing the current shell and ejecting it.", 
          count: 3
        }
      ]
    },
    Layout: {
      "scale": { "height": 336, "width": 240 },
      "layers": [
        { 
          "x": 10, 
          "y": 10, 
          "width": 220, 
          "height": 40, 
          "header": { 
            "property": ["title"], 
            "align": "center",
            "font": "Trebuchet MS"
          } 
        },
        { 
          "x": 10, 
          "y": 60, 
          "width": 220, 
          "height": 180, 
          "icon": { 
            "property": ["icon"], 
            "fill": "black" 
          }
        },
        { 
          "x": 15, 
          "y": 250, 
          "width": 250, 
          "height": 100, 
          "paragraph": { 
            "property": ["description"], 
            "align": "left",
            "font": "Verdana",
            "wrap": true 
          }
        }
      ]
    }
  };
});
