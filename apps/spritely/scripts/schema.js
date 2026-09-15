namespace('sp.spritely.Schema', {
  'sp.spritely.SpritelyUtil': 'SpritelyUtil'
}, ({ SpritelyUtil }) => {
  const ajv = new ajv7();
    ajv.addKeyword({
    keyword: 'validPaletteIndex',
    type: 'integer',
    validate: function validate(schema, data, parentSchema, dataCxt) {
      const palette = dataCxt.rootData.palette;
      const isValid = Array.isArray(palette) && data >= 0 && data < palette.length;
      if (!isValid) {
        validate.errors = [{
          keyword: 'validPaletteIndex',
          message: `must be a valid index into the palette array (0 to ${palette.length - 1}), but found ${data}`,
          params: { data, paletteSize: palette.length }
        }];
      }
      return isValid;
    },
    errors: true,
  });
  ajv.addKeyword({
    keyword: 'validPixelId',
    type: 'string',
    validate: function validate(schema, data, parentSchema, dataCxt) {
      const size = dataCxt.rootData.size || 16;
      const { x, y } = SpritelyUtil.parsePixelId(data);
      const isValid = x >= 0 && x < size && y >= 0 && y < size;
      if (!isValid) {
        validate.errors = [{
          keyword: 'validPixelId',
          message: `coordinate ${data} (${x},${y}) is out of bounds for image size ${size}`,
          params: { data, x, y, size }
        }];
      }
      return isValid;
    },
    errors: true,
  });

  const schema = {
    type: 'object',
    properties: {
      palette: {
        type: 'array',
        items: { $ref: '#/$defs/color' },
      },
      pixels: {
        type: 'object',
        propertyNames: {
          pattern: '^[0-9a-vA-V]+x[0-9a-vA-V]+$',
          validPixelId: true,
        },
        patternProperties: {
          '^[0-9a-vA-V]+x[0-9a-vA-V]+$': {
            type: 'integer',
            validPaletteIndex: true,
          },
        },
        additionalProperties: false,
      },
      bgColor: { $ref: '#/$defs/color' },
      isTransparent: { type: 'boolean' },
      size: { type: 'integer', enum: [16, 32, 48] },
    },
    required: ['palette', 'pixels'],
    $defs: {
      color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
    },
  };
  const validateFn = ajv.compile(schema);


  const validate = (data) => {
    const isValid = validateFn(data);
    if (!isValid) {
      return validateFn.errors.map((e) => `${e.instancePath} ${e.message}`).join(', ');
    }
    return undefined;
  };
  return { validate };
});

