import {
    isNull,
    isNullOrUndefined,
    absentOrEmptyString,
    positiveIntToZeroPrefixedString,
    combineObjects
} from './helpers.js';

export const name = "time";


/**
 * Convert a date or datetime to a String usable as value for a date input element.
 * @param {Date|Datetime} [date] - An optional date to convert. If not specified, the current date will be used.
 * @returns {String} The date as a string which can be set as a value of a date input field.
 **/
const dateToFieldString = (date) => {
    if ( isNullOrUndefined(date) ) {
        date = new Date();
    }
    const base = [
        positiveIntToZeroPrefixedString(date.getFullYear() , 4),
        positiveIntToZeroPrefixedString(date.getMonth() + 1, 2),
        positiveIntToZeroPrefixedString(date.getDate()     , 2)
    ];
    return base.join("-");
};


const BASE_FORMAT_ARGS = {
    outerFormatArgs: {
        // This can be overriden to specify a format
        languageString: navigator.language,
        onNullMessage : 'N/A',
        // This is safe to use as a default since non-latin languages ignore it.
        toUpperCase : true,
    },
    /**
     * These should be the same as object arguments to toLocaleTimeString supported for datetimes.
     * For more information, see the following MDN page:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
     **/
    toLocaleTimeStringArgs: {}
};


const COMMON_TIME_FORMATS = {
    base   : BASE_FORMAT_ARGS,
    hour12 : combineObjects(
                BASE_FORMAT_ARGS,
                {
                    toLocaleTimeStringArgs: {hour: 'numeric', minute: 'numeric', timeZone: 'UTC', hour12: true }
                }
            ),
    hour24 : combineObjects(
                BASE_FORMAT_ARGS,
                {
                    toLocaleTimeStringArgs: {hour: 'numeric', minute: 'numeric', timeZone: 'UTC', hour12: false}
                }
            )
    };


/**
 * Return a localized string for the passed Datetime. If no format is specified, system preferences will be used.
 * @param {Datetime} dateTime - the Datetime instance to convert to a string.
 * @param {object} [objectArgs] - A format specifier object.
 * @returns {String} a user-friendly string matching the passed or system locale format.
 **/
const getLocalizedTime =
    (dateTime, objectArgs = {}) => {
        const args = combineObjects(BASE_FORMAT_ARGS, objectArgs);
        const {
            languageString,
            onNullMessage,
            toUpperCase
        } = args.outerFormatArgs;

        if ( isNull(dateTime) ) {
            return onNullMessage;
        }

        var result = dateTime.toLocaleTimeString(languageString, args.toLocaleTimeStringArgs);
        return toUpperCase ? result.toUpperCase() : result;
    };


/**
 *  Part of a workaround for time zones not having country prefixes for social and technical reasons
 *  @constant
 *  @type {Set}
 *  @default
 **/
const DEFAULT_OMITTED_REGIONS = new Set([
    "America",
    "Asia",
    "Europe",
    "Africa",
    "Pacific", // Australia is an exception as a continent & a country
    "Indian"   // Madagascar has this as its region prefix for some reason
]);


/**
 * Return a friendly display string for the passed time zone, or "Unknown Time Zone"
 * @param {String} timezoneString - the time zone to convert to a friendly version
 * @param {String} [displaySuffix] - what should be appended to the time zone
 * @param {Set} [omitRegions] - a set of time zone suffixes to remove.
 * @returns {String} a user-friendly version of the time zone string, or "Unknown Time Zone"
 **/
const getDisplayTimeZoneString = (timezoneString, omitRegions = DEFAULT_OMITTED_REGIONS) => {

    if ( absentOrEmptyString(timezoneString) ) {
        return "Unknown Timezone";
    }

    const rawParts = timezoneString.split('/');
    const zoneName = rawParts.pop();
    const outParts = [zoneName];

    // Include the region if it's not a single-length time zone or forbidden region
    if ( (! zoneName.startsWith("GMT")) && rawParts.length > 0 ) {
        const regionName = rawParts.pop();

        if ( ! omitRegions.has(regionName) ) {
            outParts.push(", ", regionName);
        }
    }

    return outParts
        .join("")
        .replaceAll("_", " "); // Some time zone strings contain underscores as space stand-ins
}


export {
    dateToFieldString,
    BASE_FORMAT_ARGS,
    COMMON_TIME_FORMATS,
    getLocalizedTime,
    getDisplayTimeZoneString
};
