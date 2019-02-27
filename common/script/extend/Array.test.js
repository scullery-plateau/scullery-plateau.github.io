describe("Array", function() {
  describe(".last", function() {
    it("simple",function() {
      expect([1, 2, 3].last()).to.equal(3);
      expect([3, 2, 1].last()).to.equal(1);
      expect([6, 5, 4, 3, 2].last()).to.equal(2);
    })
    it("empty",function() {
      expect([].last()).to.be.undefined();
    })
  })
  describe(".repeat", function() {
    
  })
  describe(".groupBy", function() {
    
  })
})