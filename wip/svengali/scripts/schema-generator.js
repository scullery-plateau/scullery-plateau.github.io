namespace('sp.svengali.SchemaGenerator', {}, () => {
  const getPropertyKey = (binding) => {
    if (Array.isArray(binding)) {
      return binding[0];
    }
    if (binding && typeof binding === 'object' && binding.path) {
      return binding.path[0];
    }
    return null;
  };

  const generate = (layout) => {
    const cardProperties = {
      count: {
        type: 'integer',
        minimum: 1,
        description: 'Number of copies of this card to print.'
      }
    };

    layout.layers.forEach((layer) => {
      // Handle the primary property for each layer type
      const mainBinding = (layer.header || layer.icon || layer.paragraph)?.property;
      const mainKey = getPropertyKey(mainBinding);
      if (mainKey) {
        cardProperties[mainKey] = { type: 'string' };
      }

      // Handle other potential bindings (rotate, font, etc.)
      const configs = [
        layer.header,
        layer.icon,
        layer.paragraph,
        layer // BaseLayer properties
      ];

      configs.forEach(conf => {
        if (!conf) return;
        Object.entries(conf).forEach(([prop, binding]) => {
          if (prop === 'property') return; // Handled above
          const key = getPropertyKey(binding);
          if (key) {
            // Determine type based on property name or layer context
            let type = 'string';
            if (['rotate', 'x', 'y', 'width', 'height', 'outlineWidth', 'lineHeight'].includes(prop)) {
              type = 'number';
            } else if (['wrap', 'preserveAspectRatio'].includes(prop)) {
              type = 'boolean';
            }
            cardProperties[key] = { type };
          }
        });
      });
    });

    return {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Svengali Data Schema",
      "type": "object",
      "required": ["CARDS"],
      "properties": {
        "CARDS": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": cardProperties,
            "additionalProperties": true
          }
        }
      }
    };
  };

  return { generate };
});
