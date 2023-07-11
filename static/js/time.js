import {
    isNull,
    isNullOrUndefined,
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


export {
    dateToFieldString,
    BASE_FORMAT_ARGS,
    COMMON_TIME_FORMATS,
    getLocalizedTime,
};
