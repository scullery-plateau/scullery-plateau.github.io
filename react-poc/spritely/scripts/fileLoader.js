namespace("LoadFile",() => {
    let fileLoaderFns = {
        text: (reader, file) => {
            return reader.readAsText(file);
        },
        dataURL: (reader, file) => {
            return reader.readAsDataURL(file);
        },
    };
    return function(isMultiple, loadAs, loadFileFn, fileLoadErrorFn) {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        if (isMultiple) {
            input.setAttribute("multiple","true");
        }
        input.addEventListener("change",(e) => {
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
        input.click();
    }
});