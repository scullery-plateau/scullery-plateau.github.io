(function () {
  let fileLoaderFns = {
    text: (reader, file) => {
      return reader.readAsText(file);
    },
    dataURL: (reader, file) => {
      return reader.readAsDataURL(file);
    },
  };
  window.loadFilesAs = function (
    files,
    loadAs,
    processLoadedFileFn,
    loadingErrorFn
  ) {
    files.forEach((file) => {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          processLoadedFileFn(reader.result.toString(), file.name);
        } catch (e) {
          loadingErrorFn(file.name, e);
        }
      };
      fileLoaderFns[loadAs](reader, file);
    });
  };
})();
