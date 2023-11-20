namespace('sp.common.LoadFile', () => {
  let fileLoaderFns = {
    text: (reader, file) => {
      return reader.readAsText(file);
    },
    dataURL: (reader, file) => {
      return reader.readAsDataURL(file);
    },
  };
  return function (isMultiple, loadAs, loadFileFn, fileLoadErrorFn) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    if (isMultiple) {
      input.setAttribute('multiple', 'true');
      input.addEventListener('change', (e) => {
        const results = {};
        const files = Array.from(e.target.files);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onload = function () {
            try {
              results[file.name] = ["file", reader.result.toString()];
            } catch (e) {
              results[file.name] = ["error", e];
            }
            const entries = Object.entries(results);
            if (entries.length >= files.length) {
              const errors = entries.filter(([_,[resultType]]) => (resultType == "error")).map(([filename, [_,error]]) => {filename, error});
              if (errors.length > 0) {
                fileLoadErrorFn(errors);
              } else {
                loadFileFn(Object.entries(results).map(([filename, [_, contents]]) => {
                  const retVal = { filename };
                  retVal[loadAs] = contents;
                  return retVal;
                }));
              }
            }
          };
          fileLoaderFns[loadAs](reader, file);
        });
      });
    } else {
      input.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach((file) => {
          let reader = new FileReader();
          reader.onload = function () {
            try {
              loadFileFn(reader.result.toString(), file.name);
            } catch (e) {
              fileLoadErrorFn(file.name, e);
            }
          };
          fileLoaderFns[loadAs](reader, file);
        });
      });
    }
    input.click();
  };
});
