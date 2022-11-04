namespace("Constants",() => {
    const constants = {
        pixelDim:10,
        defaultColor:'#999999',
        bgColorPixelId:'bgColorPixel'
    }
    return Object.entries(constants).reduce((out,[k,v]) => {
        out[k] = (() => v);
        return out;
    }, {});
});