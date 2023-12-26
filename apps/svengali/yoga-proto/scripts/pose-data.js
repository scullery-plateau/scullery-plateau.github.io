namespace("sp.yoga-proto.PoseData",{},() => {
  const categories = {
    "Warm-Up":{
      "firstRow":0,
      "maxRowWidth": 5,
      "names":[
        "Cat", "Cow", "Melting Heart", "Child's", "Standing Forward Bend"
      ]
    },
    "Stretching":{
      "firstRow":1,
      "maxRowWidth": 5,
      "names":[
        "Pyramid", "Downward Facing Dog", "Garland", "Seated Forward Bend", "Bound Angle", "Head To Knee Forward Bend", "Half Lord Of The Fishes", "Hero", "Wide-Angle Seated Forward Bend"
      ]
    },
    "Balance":{
      "firstRow":3,
      "maxRowWidth": 5,
      "names":[
        "Tree", "Lord of the Dance", "Eagle", "Standing Split", "Half Moon", "Warrior 3", "Handstand", "Crow", "Extended Hand-to-Big-Tow", "Dancing Shiva"
      ]
    },
    "Strength":{
      "firstRow":5,
      "maxRowWidth": 5,
      "names":[
        "Warrior 1", "Warrior 2", "Goddess", "Humble Warrior", "Four-Limbed Staff", "Upward Plank", "Chair", "Dolphin", "Triangle", "High Lunge"
      ]
    },
    "Core":{
      "firstRow":7,
      "maxRowWidth": 5,
      "names":[
        "Plank", "Side Plank", "Boat", "One-Legged Downward Dog", "Scale"
      ]
    },
    "Backbending":{
      "firstRow":8,
      "maxRowWidth": 4,
      "names":[
        "Cobra", "Upward Facing Dog", "Locust", "Bow", "Camel", "Reclining Hero", "One-Legged King Pigeon", "Upward Bow"
      ]
    },
    "Restorative/Warm-Down":{
      "firstRow":10,
      "maxRowWidth": 5,
      "names":[
        "Legs Up The Wall", "Shoulder Stand", "Plow", "Easy", "Happy Baby", "Reclining Bound Angle", "Reclining Hand To Big Toe", "Supine Spinal Twist", "Half Pigeon", "Corpse"
      ]
    }
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
    selectedThumbnail: 0,
    categories
  }
});