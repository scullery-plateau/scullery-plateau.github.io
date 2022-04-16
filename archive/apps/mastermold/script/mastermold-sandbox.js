function defImg(img) {
  return {
    tag:"image",
    attrs:{
      x:3,
      y:2,
      width:90,
      height:135,
      "xlink:href":(img)
    }
  }
}

function defG(img,i) {
  return [{
    tag:"g",
    attrs:{id:"img" + i},
    content:[defImg(img)]
  },{
    tag:"g",
    attrs:{id:"frame" + i},
    content:[{
      tag:"rect",
      attrs:{
        x:1,
        y:1,
        width:141,
        height:94,
        fill:"none",
        "stroke-width":1,
        stroke:"black"
      }
    },{
      tag:"rect",
      attrs:{
        x:143,
        y:1,
        width:141,
        height:94,
        fill:"none",
        "stroke-width":1,
        stroke:"black"
      }
    },{
      tag:"use",
      attrs:{
        "xlink:href":"#img" + i,
        transform:"rotate(90,51,50) translate(0,-38)"
      }
    },{
      tag:"use",
      attrs:{
        "xlink:href":"#img" + i,
        transform:"rotate(-90,51,50) translate(5,145)"
      }
    }]
  }]
}

function frameImg(i,x,y) {
  return [{
    tag:"use",
    attrs:{ x:x, y:y, "xlink:href":"#frame" + i }
  }]
}

  
function demo() {
  var path = "../../archive/dalelands/";
  var ext = ".png";
  var images = [
    "bear",
    "belinda",
    "carl",
    "doppelganger",
    "halfling_rogue",
    "jon",
    "lightninggarin",
    "matt2",
    "munro",
    "oscoril_drow",
    "robert2",
    "sam2",
    "shaliidrow",
    "skeleton",
    "wererat_guard",
    "werewolf",
    "zana"
  ];
  
  var urls = images.map((i) => path + i + ext);
  
  display(urls);
}

function displayFromInput(input) {
  display(input.split("\n").slice(0,20));
}

function display(urls) {
  
  document.getElementById("gallery").innerHTML = urls.map(function(url) {
    return JSON.toXML({
      tag:"svg",
      attrs:{
        width:96,
        height:144
      },
      content:[{
        tag:"rect",
        attrs:{
          x:1,
          y:1,
          width:94,
          height:142,
          fill:"none",
          stroke:"black",
          "stroke-width":1
        }
      },defImg(url)]
    })
  }).join("");

  document.getElementById("print").innerHTML = JSON.toXML({
    tag:"svg",
    attrs:{
      width:7*96,
      height:10*96
    },
    content:[{
      tag:"defs",
      content:urls.reduce(function(out, img, i) {
        return out.concat(defG(img,i))
      },[])
    }].concat(urls.reduce(function(out,img,i) {
      var x = (i % 2) * 336 + 24;
      var y = Math.floor(i / 2) * 96;
      return out.concat(frameImg(i,x,y));
    }, []))
  });
}
