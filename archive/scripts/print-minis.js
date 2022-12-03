(function(){
    let partition = function (myArray, partitionSize) {
        let incoming = Array.from(myArray);
        let partitions = [];
        while (incoming.length > 0) {
            partitions.push(incoming.splice(0, partitionSize));
        }
        return partitions;
    };
    let svgFrame = function (content) {
        return `<svg viewBox="0 0 80 100">${content}</svg>`;
    };
    let miniFrames = {
        1: {
            rows: 10,
            cols: 2,
            width: 40,
            height: 10,
            svg: [
                ['ellipse', 5, 5, 4.75, 4.5],
                ['ellipse', 35, 5, 4.75, 4.5],
                ['rect', 5, 0.5, 15, 9],
                ['rect', 20, 0.5, 15, 9],
                ['image', 0, 0, 8, 12, ['matrix', 0, 1, -1, 0 , 19, 1]],
                ['image', 0, 0, 8, 12, ['matrix', 0, -1, 1, 0 , 21, 9]],
            ],
        },
        2: {
            rows: 5,
            cols: 1,
            width: 80,
            height: 20,
            svg: [
                ['ellipse', 10, 10, 9.75, 9.5],
                ['ellipse', 70, 10, 9.75, 9.5],
                ['rect', 10, 0.5, 30, 19],
                ['rect', 40, 0.5, 30, 19],
                ['image', 0, 0, 18, 27, ['matrix', 0, 1, -1, 0 , 38, 1]],
                ['image', 0, 0, 18, 27, ['matrix', 0, -1, 1, 0 , 42, 19]],
            ]
        },
        3: {
            rows: 3,
            cols: 1,
            width: 80,
            height: 30,
            svg: [
                ['ellipse', 10, 15, 9.75, 14],
                ['ellipse', 70, 15, 9.75, 14],
                ['rect', 10, 1, 30, 28],
                ['rect', 40, 1, 30, 28],
                ['image', 0, 0, 26, 26, ['matrix', 0, 1, -1, 0 , 38, 2]],
                ['image', 0, 0, 26, 26, ['matrix', 0, -1, 1, 0 , 42, 28]]
            ]
        },
        4: {
            rows: 1,
            cols: 2,
            width: 40,
            height: 100,
            svg: [
                ['ellipse', 20, 15, 19, 14.75],
                ['ellipse', 20, 85, 19, 14.75],
                ['rect', 1, 15, 38, 35],
                ['rect', 1, 50, 38, 35],
                ['image', 0, 0, 36, 31.5, ['matrix', -1, 0, 0, -1 , 38, 48]],
                ['image', 0, 0, 36, 31.5, ['matrix', 1, 0, 0, 1 , 2, 52]]
            ]
        },
    };
    let shapeStyles = {
        fill: "white",
        stroke: "black",
        strokeWidth: 0.25,
    }
    let shaper = {
        rect:function(x,y,width,height) {
            return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${shapeStyles.fill}" stroke="${shapeStyles.stroke}" stroke-width="${shapeStyles.strokeWidth}"/>`;
        },
        path:function() {
            let points = Array.from(arguments).map(a => a.join(',')).join(" ");
            return `<polygon points="${points}" fill="${shapeStyles.fill}" stroke="${shapeStyles.stroke}" stroke-width="${shapeStyles.strokeWidth}"/>`
        },
        ellipse:function(cx, cy, rx, ry) {
            return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${shapeStyles.fill}" stroke="${shapeStyles.stroke}" stroke-width="${shapeStyles.strokeWidth}"/>`;
        }
    }
    let buildTfAttr = function(transform) {
        let tfType = transform[0];
        let args = Array.from(transform).slice(1);
        return `transform="${tfType}(${args.join(', ')})"`;
    }
    window.buildDefs = function(size,files) {
        let {svg} = miniFrames[size];
        let frame = `<g id="frame${size}">` + svg.filter((shape) => (shape[0] != 'image')).map((shape) => {
            return shaper[shape[0]].apply(null,shape.slice(1));
        }).join('\n') + '</g>';
        let images = svg.filter((shape) => (shape[0] == 'image')).map(i => i.slice(1));
        let content = Object.entries(files).map(([filename,url]) => {
            let imageGroup = images.map(([x,y,width,height,transform]) => {
                let tfAttr = buildTfAttr(transform) || '';
                return `<image x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${url}" ${tfAttr}/>`;
            }).join('\n');
            return `<g id="${filename}.${size}">${imageGroup}</g>`;
        }).join('\n')
        return `<svg width="0" height="0"><defs>${frame}${content}</defs></svg>`;
    };
    window.buildPages = function(size,minis) {
        let {rows,cols,width,height} = miniFrames[size];
        let partitionSize = rows * cols;
        let partitions = partition(minis,partitionSize);
        return partitions.map((p) => {
            let page = [];
            for (let r = 0; r<rows; r++) {
                for (let c = 0; c<cols; c++) {
                    let i = cols * r + c;
                    let x = width * c;
                    let y = height * r;
                    page.push(`<use x="${x}" y="${y}" href="#frame${size}"/>`)
                    page.push(`<use x="${x}" y="${y}" href="#${p[i]}.${size}"/>`)
                }
            }
            return svgFrame(page.join('\n'))
        });
    };
    window.printMiniPages = function(title,size,minisList) {
        let files = minisList.reduce((out, m) => {
            out[m.filename] = m.url;
            return out;
        }, {});
        let minis = minisList.reduce((out, m) => {
            return out.concat(Array(m.count).fill(m.filename));
        }, []);
        let defs = buildDefs(size,files);
        let pages = buildPages(size,minis);
        printSvgPages(title, 'portrait', defs, pages);
    }
})()