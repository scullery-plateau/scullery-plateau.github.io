namespace('sp.outfitter.Shareable',{
  'sp.outfitter.Constants':'c'
},({ c }) => {
  const delim = ",";
  const rowDelim = "\n";
  const bodyTypes = ['fit','hulk','superman','woman'];
  const headerFields = ['bodyType','bgColor','bgPattern','bodyScale'];
  const rowFields = ['part','index','base','detail','outline','opacity','resizeX','resizeY','moveX','moveY','pattern','shading','flip'];
  const fieldMap = {
    part: ['partGroupIndex','partTypeIndex']
  }
  const parseFields = rowFields.reduce((out,field)=> out.concat(fieldMap[field] || [field]),[]);
  const colorOutReducer = ((out,color) => out.push(color.replace('#','')));
  const outReducers = {
    bodyType:(out,value) => out.push(bodyTypes.indexOf(value)),
    bgColor:colorOutReducer,
    part:(out,value) => c.getPartTypeIndicies(value).forEach((i) => out.push(i)),
    base:colorOutReducer,
    detail:colorOutReducer,
    outline:colorOutReducer,
  }
  const defaultOutReducer = ((out,value) => out.push(value));
  const getRowOutReducer = function(data) {
    return (out, field) => {
      const value = data[field];
      const reducer = outReducers[field] || defaultOutReducer;
      if (value || (typeof value === 'number')) {
        reducer(out, value);
      } else {
        out.push("");
      }
      return out;
    }
  }
  const publish = function(data) {
    const rows = [headerFields.reduce(getRowOutReducer(data),[]).join(delim)];
    data.layers.forEach((layer) => {
      rows.push(rowFields.reduce(getRowOutReducer(layer),[]).join(delim));
    });
    return btoa(rows.join(rowDelim));
  }
  const colorParseMapper = (([color]) => "#" + color);
  const intMapper = (([str]) => parseInt(str));
  const floatMapper = (([str]) => parseFloat(str));
  const parseMapper = {
    bodyType:(([index]) => bodyTypes[index]),
    bgColor:colorParseMapper,
    bgPattern:intMapper,
    part:(([groupIndex,typeIndex]) => c.getPartTypesByGroup(c.getPartGroups()[groupIndex])[typeIndex].part),
    base:colorParseMapper,
    detail:colorParseMapper,
    outline:colorParseMapper,
    pattern:intMapper,
    shading:intMapper,
    moveX:floatMapper,
    moveY:floatMapper,
    resizeX:floatMapper,
    resizeY:floatMapper,
    opacity:floatMapper,
    index:intMapper
  }
  const identity = (([c]) => c);
  const parse = function(dataText) {
    const [header, ...rows] = atob(dataText).split(rowDelim);
    const out = {};
    header.split(delim).forEach((value,index) => {
      const field = headerFields[index];
      const mapper = parseMapper[field] || identity;
      out[field] = mapper([value]);
    });
    out.layers = rows.map((row) => {
      const temp = row.split(delim).reduce((acc,value, index) => {
        if (value.length > 0) {
          acc[parseFields[index]] = value;
        }
        return acc;
      },{});
      const obj = {};
      rowFields.forEach((rowField) => {
        const mapper = parseMapper[rowField] || identity;
        const fieldList = fieldMap[rowField] || [rowField];
        const values = fieldList.map((field) => temp[field]);
        if (values.filter(v => v).length === fieldList.length) {
          obj[rowField] = mapper(values);
        }
      });
      return obj;
    });
    return out;
  }
  return { publish, parse };
});
