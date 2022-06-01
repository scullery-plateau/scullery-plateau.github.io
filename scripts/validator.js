(function () {
  window.validator = function (meta, predicate) {
    let types = Array.from(arguments)
      .map((a) => typeof a)
      .join(',');
    switch (types) {
      case 'string,function':
        meta = { name: meta };
        break;
      case 'object,function':
        if (isArray(meta)) {
          throw 'First argument cannot be an array';
        }
      default:
        throw "Validator arguments' types are invalid: " + types;
    }
    predicate.meta = meta;
    return predicate;
  };
  let objectValidator,
    mapValidator,
    arrayValidator,
    stringValidator,
    numberValidator,
    booleanValidator,
    keywordValidator;
  window.validateObject = function (args, constraint) {
    constraint = constraint || (() => {});
    let argErrors = objectValidator(args);
    if (argErrors) {
      throw argErrors;
    }
    args.required = args.required || [];
    let propKeys = Object.keys(args.properties);
    let missingRequired 
  };
  window.validateMap = function (args, constraint) {};
  window.validateArray = function (args, pred) {};
  window.validateString = function (args, pred) {};
  window.validateNumber = function (args, pred) {};
  window.validateBoolean = function (args, pred) {};
  objectValidator = validateObject(
    {
      properties: {
        properties: validateMap({
          keys: validateString(),
          values: validateFunction(),
        }),
        required: validateArray({
          arrayOf: validateString(),
        }),
      },
      required: ['properties'],
    },
    (obj) => {
      let keys = Object.keys(obj.properties);
      let badRequired = obj.required.filter((r) => keys.indexOf(r) < 0);
      if (badRequired.length > 0) {
        return {
          badRequired: badRequired,
          message: 'Undeclared properties in required.',
        };
      }
    }
  );
})();
