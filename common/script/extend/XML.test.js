describe("XML",function() {
  var parser = new DOMParser();
  var xml2json = function(str) {
    return parser.parseFromString(str,"application/xml").toSimpleJSON()
  }
  var xml2obj = function(str) {
    return parser.parseFromString(str,"application/xml").toObjectJSON()
  }
  describe(".toSimpleJSON",function() {
    it("tag name only",function(){
      expect(xml2json('<x/>')).to.deepEqual({tag:"x",attrs:{},content:[]});
      expect(xml2json('<abc/>')).to.deepEqual({tag:"abc",attrs:{},content:[]});
      expect(xml2json('<hi-there/>')).to.deepEqual({tag:"hi-there",attrs:{},content:[]});
    })
  })
})