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

export {
    firstLevelPropsToObj,
    firstLevelPropsToArray,
    boundCheck,
    symmetricCheck
};