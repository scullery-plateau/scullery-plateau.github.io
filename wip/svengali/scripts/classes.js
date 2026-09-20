namespace('sp.svengali.Classes', {
  'sp.svengali.Ratios': 'Ratios'
}, ({ Ratios }) => {

  class Layer {
    constructor(config) {
      this.x = config.x || 0;
      this.y = config.y || 0;
      this.width = config.width || 0;
      this.height = config.height || 0;
      this.binding = config.binding;
    }

    resolve(record, binding) {
      const b = (arguments.length > 1) ? binding : this.binding;
      if (typeof b === 'string') {
        return b;
      }
      if (Array.isArray(b)) {
        return record[b[0]];
      }
      if (b && typeof b === 'object') {
        return record[b.path[0]] || b.default;
      }
      return "";
    }

    render(record, icons) {
      throw new Error("render() must be implemented by subclass");
    }
  }

  class HeaderLayer extends Layer {
    constructor(config) {
      super({ ...config, binding: config.header.property });
      this.font = config.header.font || "Arial";
      this.align = config.header.align || "left";
    }

    calculateFontSize(text) {
      let fontSize = Math.floor(this.height * 0.8);
      let fit = false;
      while (!fit && fontSize > 6) {
        const width = text.split('').reduce((w, char) => w + (Ratios.getCharRatio(this.font, char) * fontSize), 0);
        if (width <= this.width) {
          fit = true;
        } else {
          fontSize -= 1;
        }
      }
      return fontSize;
    }

    render(record, icons) {
      const text = this.resolve(record);
      const fontSize = this.calculateFontSize(text);
      
      const anchor = this.align === 'center' ? 'middle' : (this.align === 'right' ? 'end' : 'start');
      const xPos = anchor === 'middle' ? this.x + this.width / 2 : (anchor === 'end' ? this.x + this.width : this.x);
      const centerY = this.y + (this.height / 2) + (fontSize * 0.35); // V-centering approximation

      return `<text x="${xPos}" y="${centerY}" font-family="${this.font}" font-size="${fontSize}" text-anchor="${anchor}" font-weight="bold">${text}</text>`;
    }
  }

  class ParagraphLayer extends Layer {
    constructor(config) {
      super({ ...config, binding: config.paragraph.property });
      this.font = config.paragraph.font || "Arial";
      this.lineHeight = config.paragraph.lineHeight || 1.2;
      this.align = config.paragraph.align || "left";
    }

    calculateStringWidth(text, fontSize) {
      return text.split('').reduce((w, char) => w + (Ratios.getCharRatio(this.font, char) * fontSize), 0);
    }

    wrapText(text, fontSize) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        if (this.calculateStringWidth(testLine, fontSize) < this.width) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }

    calculateMaxFontSize(text) {
      let fontSize = Math.floor(this.height * 0.2); 
      let fit = false;
      while (!fit && fontSize > 8) {
        const lines = this.wrapText(text, fontSize);
        const totalHeight = lines.length * fontSize * this.lineHeight;
        if (totalHeight <= this.height) {
          fit = true;
        } else {
          fontSize -= 1;
        }
      }
      return fontSize;
    }

    render(record, icons) {
      const text = this.resolve(record);
      const fontSize = this.calculateMaxFontSize(text);
      const lines = this.wrapText(text, fontSize);
      
      const anchor = this.align === 'center' ? 'middle' : (this.align === 'right' ? 'end' : 'start');
      const xPos = anchor === 'middle' ? this.x + this.width / 2 : (anchor === 'end' ? this.x + this.width : this.x);
      
      const svgText = lines.map((line, i) => `
        <tspan x="${xPos}" dy="${i === 0 ? 0 : (this.lineHeight + 'em')}">${line}</tspan>
      `).join('');

      return `
        <text x="${xPos}" y="${this.y + fontSize}" font-family="${this.font}" font-size="${fontSize}" text-anchor="${anchor}">
          ${svgText}
        </text>
      `;
    }
  }

  class IconLayer extends Layer {
    constructor(config) {
      super({ ...config, binding: config.icon.property });
      this.fill = config.icon.fill || "black";
      this.rotateBinding = config.icon.rotate;
      this.preserveAspectRatio = (config.icon.preserveAspectRatio !== false);
      this.scaleConfig = config.icon.scale;
    }

    render(record, icons) {
      const iconKey = this.resolve(record);
      const icon = icons[iconKey];
      if (!icon) return "";

      const rotate = this.resolve(record, this.rotateBinding) || 0;
      
      const configX = this.scaleConfig?.x ?? (typeof this.scaleConfig === 'number' ? this.scaleConfig : 1);
      const configY = this.scaleConfig?.y ?? (typeof this.scaleConfig === 'number' ? this.scaleConfig : 1);

      let finalScaleX, finalScaleY;

      if (this.preserveAspectRatio) {
        // Apply multipliers to original dimensions to get effective size
        const effectiveWidth = icon.width * configX;
        const effectiveHeight = icon.height * configY;

        // Fit this effective size into the bounding box
        const fitScale = Math.min(this.width / effectiveWidth, this.height / effectiveHeight);

        finalScaleX = configX * fitScale;
        finalScaleY = configY * fitScale;
      } else {
        finalScaleX = configX;
        finalScaleY = configY;
      }

      const offsetX = this.x + (this.width - (icon.width * finalScaleX)) / 2;
      const offsetY = this.y + (this.height - (icon.height * finalScaleY)) / 2;

      const transform = [
        `translate(${offsetX}, ${offsetY})`,
        `scale(${finalScaleX}, ${finalScaleY})`
      ];

      if (rotate) {
        transform.push(`rotate(${rotate}, ${icon.width / 2}, ${icon.height / 2})`);
      }

      return `
        <g transform="${transform.join(' ')}">
          <path d="${icon.path}" fill="${this.fill}" />
        </g>
      `;
    }
  }

  const POKER_WIDTH = 240;
  const POKER_HEIGHT = 336;

  class Layer {
// ... existing code ...
  class SvengaliLayout {
    constructor(layoutConfig) {
      const isLandscape = layoutConfig.orientation === 'landscape';
      this.cardWidth = isLandscape ? POKER_HEIGHT : POKER_WIDTH;
      this.cardHeight = isLandscape ? POKER_WIDTH : POKER_HEIGHT;

      this.layers = layoutConfig.layers.map(l => {
        if (l.header) {
          return new HeaderLayer(l);
        }
        if (l.icon) {
          return new IconLayer(l);
        }
        if (l.paragraph) {
          return new ParagraphLayer(l);
        }
        return null;
      }).filter(l => l !== null);
    }

    renderCard(record, id, icons) {
      const layerOutput = this.layers.map(l => l.render(record, icons)).join('\n');
      return `
        <g id="${id}">
          <rect width="${this.cardWidth}" height="${this.cardHeight}" fill="white" stroke="black" stroke-width="2" rx="10"/>
          ${layerOutput}
        </g>
      `;
    }
  }

  return { HeaderLayer, ParagraphLayer, IconLayer, SvengaliLayout };
});

