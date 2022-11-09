namespace("Schema", {"Sovereign":"s"},({s}) => {
    const colorSpec = s.patternMatches(/^#[0-9a-fA-F]{6}$/);
    const validate = s.objectOf({
        fields:{
            palette:s.everyIs(colorSpec),
            pixels:s.mapOf({
                eachKey:s.patternMatches(/^[0-9a-vA-V]+x[0-9a-vA-V]+$/),
                eachValue:s.intOf({min:0})
            }),
            backgroundColor:colorSpec,
            isTransparent:s.bool(),
            size:s.isEnum(16,32,48)
        },
        required:['palette','pixels']
    });
    return { validate };
});