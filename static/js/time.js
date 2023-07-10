import {
    isNull,
    isNullOrUndefined,
    positiveIntToZeroPrefixedString
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


/**
 * Convert a datetime to a user-friendly short display string without the date or time zone.
 * @param {Datetime} datetime - the Datetime object to convert
 * @param {Boolean} use12hour - true to use AM/PM, false to use 24 hour time ('military' time)
 * @param {String} [timeZone] - UTC by default, but any valid time zone string can be used.
 * @param {String} [onNummMessage] - What should be displayed if the datetime is null.
 * @returns {String} A user-friendly representation of a date time specific to a time.
 **/
const getHourMinString = (dateTime, use12Hour = true, timeZone = 'UTC', onNullMessage = 'N/A') => {
    if ( isNull(dateTime) ) {
        return onNullMessage;
    }
    else {
        return dateTime
            .toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: use12Hour, 'timeZone': timeZone})
            .toUpperCase();
    }
};


/**
 * Convert a datetime to short 12 hour format, ie 12:01 PM.
 * @param {Datetime} dateTime - the datetime to convert
 * @param {String} [timeZone] - a valid time zone string
 * @returns {String} - A user-friendly short display string without the date or time zone.
 **/
const hour12Format = (dateTime, timeZone = 'UTC') => getHourMinString(dateTime, true, timeZone);


/**
 * Convert a datetime to short 24 hour format, ie 20:00.
 * @param {Datetime} dateTime - the datetime to convert
 * @param {String} [timeZone] - a valid time zone string
 * @returns {String} - A user-friendly short display string without the date or time zone.
 **/
const hour24Format = (dateTime, timeZone = 'UTC') => getHourMinString(dateTime, false, timeZone);


export {
    dateToFieldString,
    getHourMinString,
    hour12Format,
    hour24Format
};
