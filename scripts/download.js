(function () {
  let fileNameInputTemplate = function (fieldId, placeholder) {
    return `<p>Feel free to enter a filename</p><div class="form-group"><label class="text-light" for="${fieldId}">Filename</label><input type="text" class="form-control rpg-textbox" id="${fieldId}" placeholder="${placeholder}"/></div>`;
  };
  let normalizeFilename = function (filename, defaultFilename) {
    if (filename.endsWith('.json')) {
      filename = filename.replace('.json', '');
    }
    filename = encodeURIComponent(filename);
    if (filename.length == 0) {
      filename = defaultFilename;
    }
    filename = filename + '.json';
    return filename;
  };
  let triggerDownload = function (fieldId, defaultFilename, jsonData) {
    let filename = normalizeFilename(
      document.getElementById(fieldId).value,
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
        handler: () => {
          triggerDownload(fieldId, defaultFilename, jsonData);
        },
      },
    ]);
  };
})();
