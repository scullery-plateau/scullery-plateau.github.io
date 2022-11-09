namespace('TokenFrame', () => {
  return function (props) {
    return (
      <div class="rpg-box m-3 d-flex">
        <div class="d-flex flex-column w-25 controls">
          <div class="form-group">
            <label for="xOffset">X-Offset:</label>
            <input
              type="number"
              value="0"
              class="form-control"
              id="xOffset"
              onchange="setXOffset(this)"
            />
          </div>
          <div class="form-group">
            <label for="yOffset">Y-Offset:</label>
            <input
              type="number"
              value="0"
              class="form-control"
              id="yOffset"
              onchange="setYOffset(this)"
            />
          </div>
          <div class="form-group">
            <label for="scale">Scale:</label>
            <input
              type="number"
              min="0"
              value="1"
              step="0.01"
              class="form-control"
              id="scale"
              onchange="setScale(this)"
            />
          </div>
          <div class="form-group">
            <label for="sideCount">Side Count:</label>
            <input
              type="number"
              min="2"
              max="50"
              value="2"
              class="form-control"
              id="sideCount"
              onchange="setSideCount(this)"
            />
          </div>
          <button class="btn btn-light">Frame Color</button>
        </div>
        <div id="canvas"></div>
      </div>
    );
  };
});
