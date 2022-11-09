namespace("Sovereign",() => {
    const build = function(pred,errFn) {
        return function(value) {
            if (!pred(value)) {
                return errFn(value);
            }
        }
    };
    const comp = function() {
        const validatorFunctions = Array.from(arguments);
        return function (value) {
            const errors = validatorFunctions.reduce((out,vfn) => {
                const error = vfn(value);
                if (Array.isArray(error)) {
                    out = out.concat(error);
                } else if ((typeof error) == 'object') {
                    out.push(error);
                }
                return out;
            },[]);
            if (errors.length > 0) {
                return errors;
            }
        }
    };
    const isArray = build(Array.isArray,(value) => {
        return {value:value,isArray:false};
    });
    const everyIs = function(validator) {
        return function(arrayValue) {
            const error = isArray(arrayValue)
            if (error) {
                return error;
            }
            const errors = arrayValue.reduce((out,value,index) => {
                const error = validator(value);
                if (error) {
                    out[index] = error;
                }
                return out;
            },{});
            if (Object.keys(errors).length > 0) {
                return errors;
            }
        }
    }
    const typeIs = function(typeInQuestion) {
        return build((value) => {
            return (typeof value) === typeInQuestion;
        }, (value) => {
            return {value,typeInQuestion};
        });
    };
    const bool = function() {
        return typeIs('boolean');
    };
    const minIs = function(min) {
        return build((value) => {
            return value >= min;
        }, (value) => {
            return {value,min};
        });
    };
    const maxIs = function(max) {
        return build((value) => {
            return value <= max;
        }, (value) => {
            return {value,max};
        });
    };
    const minLengthIs = function(minLength) {
        return build(({length}) => {
            return length >= minLength;
        }, ({length}) => {
            return {length,minLength};
        });
    };
    const maxLengthIs = function(maxLength) {
        return build(({length}) => {
            return length <= maxLength;
        }, ({length}) => {
            return {length,maxLength};
        });
    };
    const isLessThan = function(greater) {
        return build((value) => {
            return value < greater;
        }, (value) => {
            return {value,greater};
        });
    };
    const isGreaterThan = function(lesser) {
        return build((value) => {
            return value > lesser;
        }, (value) => {
            return {value,lesser};
        });
    };
    const lengthIsLessThan = function(greaterLength) {
        return build(({length}) => {
            return length < greaterLength;
        }, ({length}) => {
            return {length,greaterLength};
        });
    };
    const lengthIsGreaterThan = function(lesserLength) {
        return build(({length}) => {
            return length > lesserLength;
        }, ({length}) => {
            return {length,lesserLength};
        });
    };
    const isStep = function(step) {
        return build((value) => {
            return (value % step) === 0;
        }, (value) => {
            return {value,step};
        });
    };
    const lengthStepIs = function(lengthStep) {
        return build(({length}) => {
            return (length % lengthStep) === 0;
        }, ({length}) => {
            return {length,lengthStep};
        });
    };
    const patternMatches = function(pattern){
        return build((value) => {
            return pattern.test(value);
        }, (value) => {
            return {value,pattern};
        });
    };
    const isEnum = function() {
        const enumMap = Array.from(arguments).reduce((out,arg) => {
            out[arg] = true;
            return out;
        },{});
        const enumValues = Object.keys(enumMap);
        return build((value) => {
            return enumMap[value];
        }, (value) => {
            return {value,enumValues};
        });
    };
    const buildFromValidatorMap = function(validatorMap,opts) {
        opts.argMod = opts.argMod || ((args) => args);
        opts.initValidators = opts.initValidators || [];
        return function(args) {
            args = opts.argMod(args);
            const validators = Object.keys(args).reduce((out,key) => {
                let argList = args[key];
                if (!Array.isArray(argList)) {
                    argList = [argList];
                }
                const valFn = validatorMap[key];
                out.push(valFn.apply(null,argList));
                return out;
            },opts.initValidators);
            return comp.apply(null,validators);
        }
    }
    const intValidators = {
        min:minIs,
        max:maxIs,
        step:isStep,
        lesser:isGreaterThan,
        greater:isLessThan
    };
    const intOf = buildFromValidatorMap(intValidators,{
        initValidators:[typeIs('number')],
        argMod:(args) => {
            args.step = args.step || 1;
            return args;
        }
    });
    const floatValidators = {
        min:minIs,
        max:maxIs,
        lesser:isGreaterThan,
        greater:isLessThan
    };
    const floatOf = buildFromValidatorMap(floatValidators,{
        initValidators:[typeIs('number')]
    });
    const stringValidators = {
        minLength:minLengthIs,
        maxLength:maxLengthIs,
        lesserLength:lengthIsGreaterThan,
        greaterLength:lengthIsLessThan,
        lengthStep:lengthStepIs,
        pattern:patternMatches
    };
    const stringOf = buildFromValidatorMap(stringValidators,{
        initValidators:[typeIs('string')]
    });
    const arrayValidators = {
        minLength:minLengthIs,
        maxLength:maxLengthIs,
        lesserLength:lengthIsGreaterThan,
        greaterLength:lengthIsLessThan,
        lengthStep:lengthStepIs,
        every:everyIs
    }
    const arrayOf = buildFromValidatorMap(arrayValidators,{
        initValidators:[isArray]
    });
    const aspectOf = function(validator,aspectFn) {
        return function(value) {
            return validator(aspectFn(value));
        }
    }
    const eachKeyIs = function(validator) {
        return aspectOf(everyIs(validator),Object.keys);
    };
    const eachValueIs = function(validator) {
        return aspectOf(everyIs(validator),Object.values);
    };
    const mapValidators = {
        eachKey:eachKeyIs,
        eachValue:eachValueIs
    };
    const mapOf = buildFromValidatorMap(mapValidators,{
        initValidators:[typeIs('object')]
    });
    const objectValidators = {
        fields:function(propertyValidators) {
            const properties = Object.keys(propertyValidators);
            return function(value) {
                const fields = Object.keys(value);
                const keys = fields.filter((field) => (properties.indexOf(field) >= 0));
                const errors = keys.reduce((errors,key) => {
                    const error = propertyValidators[key](value[key]);
                    if (error) {
                        errors[key] = error;
                    }
                    return errors;
                },{});
                if (Object.keys(errors).length > 0) {
                    return errors;
                }
            };
        },
        required:function() {
            const required = Array.from(arguments);
            return function(value) {
                const keys = Object.keys(value);
                const missing = required.filter((field) => (keys.indexOf(field) < 0));
                if (missing.length > 0) {
                    return {value,missing,required};
                }
            }
        }
    };
    const objectOf = buildFromValidatorMap(objectValidators,{
        initValidators:[typeIs('object')]
    });
    return {
        build,comp,everyIs,typeIs,minIs,maxIs,isGreaterThan,isLessThan,isStep,
        minLengthIs,maxLengthIs,lengthIsGreaterThan,lengthIsLessThan,lengthStepIs,
        patternMatches,isEnum,eachKeyIs,eachValueIs,bool,intOf,floatOf,stringOf,arrayOf,mapOf,objectOf
    };
});
