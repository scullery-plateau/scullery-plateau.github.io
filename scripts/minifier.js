(function () {
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
  window.initMinifier = function (
    galleryId,
    fileLoadInputId,
    imageLoadInputId,
    aboutId,
    thumbnailTemplateId
  ) {
    initTemplate('thumbnailTemplate', thumbnailTemplateId);
    let data = {
      size: 1,
      minis: [],
    };
    window.loadfile = function (e) {
      arbitrateEvent(e);
      document.getElementById(fileLoadInputId).click();
    };
    let refreshGallery = function () {
      let thumbnailTemplate = localStorage.getItem('thumbnailTemplate');
      let html = data.minis
        .map((m, i) => {
          return thumbnailTemplate
            .replace('filename-i', m.filename)
            .replace('thumb-i', `thumb-${i}`)
            .replace('count-i', `count-${i}`)
            .replace('index-i', `${i}`);
        })
        .join('\n');
      document.getElementById(galleryId).innerHTML = html;
      data.minis.forEach((m, i) => {
        document.getElementById(
          `thumb-${i}`
        ).style = `background-image: url(${m.url})`;
        document.getElementById(`count-${i}`).value = m.count;
      });
    };
    let loadFileResultsAsJsonData = function (results, filename) {
      let jsonData = JSON.parse(results);
      let error = validateLoadFileJson(jsonData);
      if (error) {
        throw error;
      }
      ['images', 'tiles', 'placements'].forEach((field) => {
        data[field] = jsonData[field];
      });
      refreshGallery();
    };
    let processFileLoadError = function (filename, error) {
      // todo -
    };
    window.loadFiles = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'text',
        loadFileResultsAsJsonData,
        processFileLoadError
      );
    };
    window.downloadFile = function (e) {
      arbitrateEvent(e);
      initDownloadJsonPopup('minifierFileDownload', 'minifier', data);
    };
    window.showPrintable = function (e) {
      arbitrateEvent(e);
      // todo
    };
    window.removeZeroCount = function (e) {
      arbitrateEvent(e);
      data.minis = data.minis.filter((m) => m.count > 0);
    };
    window.setSize = function (e, size) {
      arbitrateEvent(e);
      data.size = size;
    };
    window.showAbout = function (e) {
      arbitrateEvent(e);
      initPopup(document.getElementById(aboutId).innerHTML);
    };
    window.addImage = function () {
      document.getElementById(imageLoadInputId).click();
    };
    let loadImageAsDataURL = function (results, filename) {
      let mini = {
        filename,
        url: results,
        count: 1,
      };
      data.minis.push(mini);
      refreshGallery();
    };
    window.loadImages = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'dataURL',
        loadImageAsDataURL,
        processFileLoadError
      );
    };
    window.updateCount = function (input, index) {
      data.minis[index].count = input.value;
    };
  };
})();
