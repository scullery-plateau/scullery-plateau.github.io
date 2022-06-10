(function () {
  window.getLocalStaticFileAsText = function (filepath, onSuccess, onFailure) {
    onFailure =
      onFailure ||
      ((resp) => {
        document.dispatchEvent(new CustomEvent('BadAJAX'), { detail: resp });
      });
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          onSuccess(this.responseText);
        } else {
          onFailure({
            requestedFile: filepath,
            status: this.status,
            statusText: this.statusText,
            responseText: this.responseText,
          });
        }
      }
    };
    xhttp.open('GET', filepath);
    xhttp.send();
  };
})();
