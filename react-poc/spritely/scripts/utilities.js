namespace("Utilities",() => {
    const getPaletteId = function (index) {
        return 'palette' + index;
    };
    const getPaletteButtonId = function (index) {
        return 'paletteBtn' + index;
    };
    const getPixelId = function (x, y) {
        return [x, y].map((i) => i.toString(32).toUpperCase()).join('x');
    };
    const parsePixelId = function (id) {
        let [x, y] = id.split('x').map((n) => parseInt(n, 32));
        return { x, y };
    };
    const merge = function() {
        return Array.from(arguments).reduce((acc,map) => {
            return Object.entries(map).reduce((out,[k,v]) => {
                out[k] = v;
                return out;
            }, acc);
        }, {});
    }
    const calcTrimBounds = function(trimToImage, width, height, keys, parseIdFn) {
        console.log({trimToImage, width, height, keys, parseIdFn});
        let [offsetX, offsetY] = [0, 0];
        if (trimToImage) {
            let { xs, ys } = keys.reduce(
                (acc, k) => {
                    let { x, y } = parseIdFn(k);
                    acc.xs.push(x);
                    acc.ys.push(y);
                    return acc;
                },
                { xs: [], ys: [] }
            );
            let [minX, minY] = [xs, ys].map((ns) =>
                ns.reduce((a, b) => Math.min(a, b), 0)
            );
            let maxX = xs.reduce((a, b) => Math.max(a, b), width - 1);
            let maxY = ys.reduce((a, b) => Math.max(a, b), height - 1);
            [offsetX, offsetY, width, height] = [
                minX,
                minY,
                maxX + 1 - minX,
                maxY + 1 - minY,
            ];
        }
        console.log({ offsetX, offsetY, width, height })
        return { offsetX, offsetY, width, height };
    };
    const rgbFromHex = function (hex) {
        if (typeof hex === 'string') {
            const [red, green, blue] = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
            return { red, green, blue };
        }
    };
    const getForegroundColor = function (hex) {
        const rgb = rgbFromHex(hex);
        const luminosity = Math.sqrt(
            Math.pow(rgb['red'], 2) * 0.299 +
            Math.pow(rgb['green'], 2) * 0.587 +
            Math.pow(rgb['blue'], 2) * 0.114
        );
        return luminosity > 186 ? 'black' : 'white';
    };
    return { getPaletteId, getPaletteButtonId, getPixelId, parsePixelId, merge, calcTrimBounds, getForegroundColor, rgbFromHex};
});