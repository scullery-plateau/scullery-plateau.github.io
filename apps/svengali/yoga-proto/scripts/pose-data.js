namespace("sp.yoga-proto.PoseData",{},() => {
  const categories = {
    "warm-up":{
      "rows":[0],
      "names":["Cat","Cow","Melting Heart"]
    },
    "stretching":{},
    "balance":{},
    "strength":{},
    "core":{},
    "backbending":{},
    "restorative/warm-down":{}
  }
  const imgDim = {
    width: 995,
    height: 1500
  }
  return {
    imgDim,
    sideMargin: 0,
    topMargin: 0,
    bottomMargin: 0,
    rowCount:12,
    maxCellCount: 5,
    boxWidth: 199,
    rowHeight: 100,
    selectedRow: 0,
    selectedThumbnail: 0
  }
});