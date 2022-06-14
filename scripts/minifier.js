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
      ['size', 'minis'].forEach((field) => {
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
    let partition = function (myArray, partitionSize) {
      let incoming = Array.from(myArray);
      let partitions = [];
      while (incoming.length > 0) {
        partitions.push(incoming.splice(0, partitionSize));
      }
      return partitions;
    };
    let svgFrame = function (content) {
      return `<svg width="8in" height="10in" viewBox="0 0 80 100">${content}</svg>`;
    };
    let miniFrames = {
      1: {
        width: 40,
        height: 10,
        svg: [
          ['rect', 5, 0, 15, 10],
          ['rect', 20, 0, 15, 10],
          ['path', [35, 0], [40, 5], [35, 10]],
          ['path', [35, 0], [40, 5], [35, 10]],
          ['image', 5, 0, 15, 10, ['rotate'], ['translate']],
          ['image', 20, 0, 10, 15, ['rotate'], ['translate']],
        ],
      },
      2: {},
      3: {},
      4: {},
    };
    let buildOneInchMinisPage = function (pageMinis) {
      return svgFrame(
        pageMinis
          .map((url, index) => {
            // todo
            return ``;
          })
          .join('\n')
      );
    };
    let buildTwoInchMinisPage = function (pageMinis) {
      return svgFrame(
        pageMinis
          .map((url, index) => {
            // todo
            return ``;
          })
          .join('\n')
      );
    };
    let buildThreeInchMinisPage = function (pageMinis) {
      return svgFrame(
        pageMinis
          .map((url, index) => {
            // todo
            return ``;
          })
          .join('\n')
      );
    };
    let buildFourInchMinisPage = function (pageMinis) {
      return svgFrame(
        pageMinis
          .map((url, index) => {
            // todo
            return ``;
          })
          .join('\n')
      );
    };
    let pageBuilders = {
      1: function (minis) {
        let pagePartitions = partition(minis, 20);
        return pagePartitions.map(buildOneInchMinisPage);
      },
      2: function (minis) {
        let pagePartitions = partition(minis, 5);
        return pagePartitions.map(buildTwoInchMinisPage);
      },
      3: function (minis) {
        let pagePartitions = partition(minis, 3);
        return pagePartitions.map(buildThreeInchMinisPage);
      },
      4: function (minis) {
        let pagePartitions = partition(minis, 2);
        return pagePartitions.map(buildFourInchMinisPage);
      },
    };
    window.showPrintable = function (e) {
      arbitrateEvent(e);
      let minis = data.minis.reduce((out, m) => {
        return out.concat(Array(m.count).fill(m.url));
      }, []);
      let pageBuilderFn = pageBuilders[data.size];
      let pages = pageBuilderFn(minis);
      printSvgPages('Minifier', 'portrait', pages);
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
