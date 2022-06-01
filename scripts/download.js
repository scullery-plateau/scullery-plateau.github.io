(function () {
  let fileNameInputTemplate = function (fieldId, placeholder) {
    return `<p>Feel free to enter a filename</p><div class="form-group"><label class="text-light" for="${fieldId}">Filename</label><input type="text" class="form-control rpg-textbox" id="${fieldId}" placeholder="${placeholder}"/></div>`;
  };
  window.normalizeFilename = function (filename, ext, defaultFilename) {
    if (filename.endsWith(ext)) {
      filename = filename.replace(ext, '');
    }
    filename = encodeURIComponent(filename);
    if (filename.length == 0) {
      filename = defaultFilename;
    }
    filename = filename + ext;
    return filename;
  };
  let triggerDownload = function (fieldId, defaultFilename, jsonData) {
    let filename = normalizeFilename(
      document.getElementById(fieldId).value,
      '.json',
      defaultFilename
    );
    let dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(jsonData));
    let body = document.getElementsByTagName('body')[0];
    let link = document.createElement('a');
    body.appendChild(link);
    link.setAttribute('href', dataStr);
    link.setAttribute('download', filename);
    link.click();
    body.removeChild(link);
  };
  window.initDownloadJsonPopup = function (fieldId, defaultFilename, jsonData) {
    initPopup(fileNameInputTemplate(fieldId, defaultFilename), [
      {
        label: 'Download',
        class: 'success',
        handler: () => {
          triggerDownload(fieldId, defaultFilename, jsonData);
        },
      },
      {
        label: 'Cancel',
        class: 'danger',
        handler: () => {},
      },
    ]);
  };
})();
