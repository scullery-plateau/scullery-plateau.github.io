namespace('sp.svengali.buckshot.Context', {}, () => {
  return {
    Data: {
      CARDS: [{ count: 6 }]
    },
    Layout: {
      "scale": { "height": 336, "width": 240 },
      "layers": [
        // Row 0: B U C K (Stretched 2x)
        { "x": 20, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.b", "fill": "black", "scale": { "y": 2 } } },
        { "x": 70, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.u", "fill": "black", "scale": { "y": 2 } } },
        { "x": 120, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.c", "fill": "black", "scale": { "y": 2 } } },
        { "x": 170, "y": 90, "width": 50, "height": 100, "icon": { "property": "solid.k", "fill": "black", "scale": { "y": 2 } } },
        // Row 1: S H crosshairs T (Square)
        { "x": 20, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.s", "fill": "black" } },
        { "x": 70, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.h", "fill": "black" } },
        { "x": 120, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.crosshairs", "fill": "black" } },
        { "x": 170, "y": 200, "width": 50, "height": 50, "icon": { "property": "solid.t", "fill": "black" } }
      ]
    }
  };
});
