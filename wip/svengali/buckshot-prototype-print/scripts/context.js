namespace('sp.svengali.buckshot.Context', {}, () => {
  return {
    cardback: {
      Data: {
        CARDS: [{ count: 6 }]
      },
      Layout: {
        "orientation": "portrait",
        "layers": [
          { "x": 20, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.b", "fill": "black", "scale": { "y": 2 } } },
          { "x": 70, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.u", "fill": "black", "scale": { "y": 2 } } },
          { "x": 120, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.c", "fill": "black", "scale": { "y": 2 } } },
          { "x": 170, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.k", "fill": "black", "scale": { "y": 2 } } },
          { "x": 20, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.s", "fill": "black" } },
          { "x": 70, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.h", "fill": "black" } },
          { "x": 120, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.crosshairs", "fill": "black" } },
          { "x": 170, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.t", "fill": "black" } }
        ]
      }
    },
    iconOnly: {
      Data: {
        CARDS: [
          { icon: "solid.bolt", count: 2 },
          { icon: "delapouite.sawed-off-shotgun", count: 2 },
          { icon: "solid.wind", count: 1 },
          { icon: "lorc.mine-explosion", rotate: 90, count: 1 }
        ]
      },
      Layout: {
        "orientation": "portrait",
        "layers": [
          {
            "x": 10,
            "y": 10,
            "width": 220,
            "height": 316,
            "icon": {
              "property": ["icon"],
              "rotate": { "path": ["rotate"], "default": 0 },
              "fill": "black"
            }
          }
        ]
      }
    },
    verbose: {
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
        "orientation": "portrait",
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
    }
  };
});
