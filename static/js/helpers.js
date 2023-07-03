const isNull = (obj) => {
    return Object.is(obj, null);
};

const isUndefined = (obj) => {
    return Object.is(obj, undefined);
}

const isNullOrUndefined = (obj) => {
    return isNull(obj, null) || isUndefined(obj, undefined);
};

const firstLevelPropsToObj = (srcObj, ...props) => {
    var outObj = {};
    props.forEach(prop => outObj[prop] = srcObj[prop]);
    return outObj;
};

const firstLevelPropsToArray = (srcObj, ...props) => {
    props.map(prop => srcObj[prop]);
};

const boundCheck = (val, min, max) => {
    if ( min > max ) {
        throw new TypeError("min must be less than max");
    }
    return (min <= val) && (val <= max);
};

const symmetricCheck = (val, sides) => {
    const high = Math.abs(sides);
    const low  = -1.0 * high;
    return boundCheck(val, low, high);
};

const isProperNormalized = (value) => {
    return boundCheck(value, 0.0, 1.0);
}

const normalizedToRange = (normalized, rangeStartInclusive, rangeEndInclusive) => {
    return (normalized * (rangeEndInclusive - rangeStartInclusive)) + rangeStartInclusive;
}

const rangeToNormalized = (withinRange, rangeStartInclusive, rangeEndInclusive) => {
    return ( withinRange - rangeStartInclusive ) / ( rangeEndInclusive - rangeStartInclusive );
};


export {
    isNull,
    isUndefined,
    isNullOrUndefined,
    firstLevelPropsToObj,
    firstLevelPropsToArray,
    boundCheck,
    symmetricCheck,
    isProperNormalized,
    normalizedToRange,
    rangeToNormalized,
};