namespace('sp.common.CSV',{},() => {
  const parse = function(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    const objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );
    let arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
      let strMatchedDelimiter = arrMatches[ 1 ];
      if ( strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)){
        arrData.push( [] );
      }
      let strMatchedValue = arrMatches[ 3 ];
      if (arrMatches[ 2 ]){
        strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
  }
  return { parse };
});