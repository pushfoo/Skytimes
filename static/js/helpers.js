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


/**
 * Recursively override values in the first object with those of the second. Does not yet support maps.
 * @param {object} destination - the object to write to.
 * @param {object} source - a source object to copy from.
 * @returns {undefined}
 **/
const overrideObjectValuesFrom = (destination, source) => {
   for (const [key, sourceValue] of Object.entries(source)) {
        const destinationValue = destination[key];
        const destinationType = typeof destinationValue;
        const sourceType = typeof sourceValue;

        // Skip recursion on non-object types
        if ( sourceType !== "object" ) {
            destination[key] = sourceValue;
        }

        // Whenever the value is an object, recursively copy its values onto
        // a new object, then use the new object as a value on this one.
        else {
            const objDest = destinationType === "object" ? destinationValue : {};
            overrideObjectValuesFrom(objDest, sourceValue);
            destination[key] = objDest;
        }
   }
}


/**
 * Recursively combine the passed objects into a single object. Does not yet support maps.
 * @param {...object} objects - one more more objects to combine
 * @returns {object} a new object combining the values of the passed objects. Last item has highest priority.
 */
const combineObjects = (...objects) => {
    const resultObject = {};
    for (const currentObject of objects) {
        overrideObjectValuesFrom(resultObject, currentObject);
    }
    return resultObject;
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


/**
 * Convert a positive integer to a string, left-padded to the specified length with zeroes.
 * @param {number} sourceInt - an integer number
 * @param {number} goalLength - how many zeroes should be on the left
 * @returns {String} A string version of the given integer, left-padded with zeroes to reach the given length.
 **/
const positiveIntToZeroPrefixedString = (sourceInt, goalLength) => {
    const unpaddedString = sourceInt.toString();
    if ( sourceInt < 0 ) {
        throw new TypeError(`sourceInt must be >= 0, but got ${unpaddedString}`);
    }
    if ( unpaddedString.length > goalLength ) {
        throw new TypeError("sourceInt has more places than goalLength!");
    }
    return unpaddedString.padStart(goalLength, "0");
};


/**
 * Skip the first element or elements of an iterator
 * @param {Iterator}
 * @returns {Iterator} the same iterator
 **/
const skip = (iterator, num = 1) => {
    if (num < 0) {
        throw new TypeError("Can't skip a negative number of elements!");
    }
    for (var i = 0; i < num; i++) {
        iterator = iterator.next();
    }
    return iterator;
};

/**
 * A generator function which adapts arrays for use with other iterators
 * @generator
 * @param {Array} array - the array to adapt.
 * @yields {*} The next element in the passed array.
 **/
function* arrayIterator(array) {
    for(var i = 0; i < array.length; i++) {
        yield array[i];
    }
}

/**
 * Yields arrays with the same length as the number of sources until it can't make a full row.
 * @generator
 * @param {...array|Iterator} sources - Arrays and/or iterators to zip.
 * @yields {array} 0 or more arrays of the same length as the number of sources
 **/
function* zip(...sources) {
    const iterators = [];
    for (const source of sources) {
        if ( Array.isArray(source) ) {
            iterators.push(arrayIterator(source));
        } else {
            iterators.push(source)
        }
    }

    var running = true;
    let nextResult = undefined;
    while (running) {
         const yieldArray = [];
         for ( var i = 0; i < iterators.length; i++ ) {
            next_result = iterators[i].next();
            if ( next_result.done ) {
                running = false;
                break;
            }
            yieldArray.push(next_result.value);
         }
         if( running ) {
            yield yieldArray;
         }
    }
}


export {
    isNull,
    isUndefined,
    isNullOrUndefined,
    firstLevelPropsToObj,
    firstLevelPropsToArray,
    overrideObjectValuesFrom,
    combineObjects,
    boundCheck,
    symmetricCheck,
    isProperNormalized,
    normalizedToRange,
    rangeToNormalized,
    positiveIntToZeroPrefixedString,
    arrayIterator,
    zip
};