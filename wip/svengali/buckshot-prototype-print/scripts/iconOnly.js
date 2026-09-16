namespace('sp.svengali.buckshot.Context', {}, () => {
  return {
    Data: {
      CARDS: [
        { icon: "solid.bolt", count: 6 },
        { icon: "delapouite.sawed-off-shotgun", count: 6 },
        { icon: "solid.wind", count: 3 },
        { icon: "lorc.mine-explosion", rotate: 90, count: 3 }
      ]
    },
    Layout: {
      "scale": { "height": 336, "width": 240 },
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
  };
});
