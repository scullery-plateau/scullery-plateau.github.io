namespace('sp.svengali.Validator', {}, () => {
  const ajv = new ajv7();

  const fetchSchema = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch schema from ${url}: ${response.statusText}`);
    }
    return response.json();
  };

  const validate = async (data, schemaUrl) => {
    try {
      const schema = await fetchSchema(schemaUrl);
      const validateFn = ajv.compile(schema);
      const isValid = validateFn(data);
      
      if (!isValid) {
        return validateFn.errors.map(e => `${e.instancePath} ${e.message}`).join(', ');
      }
      return undefined;
    } catch (error) {
      return `Schema Error: ${error.message}`;
    }
  };

  return { validate };
});
