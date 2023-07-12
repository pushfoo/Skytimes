import {
    isNull,
    isNullOrUndefined,
    combineObjects,
    normalizedToRange,
    overrideObjectValuesFrom
} from './helpers.js';

import {
    dateToFieldString,
    getLocalizedTime,
    COMMON_TIME_FORMATS,
    getDisplayTimeZoneString
} from './time.js';

import { SunAPI } from './sunapi.js';
import { Coordinates } from './coordinates.js';
import { WorldMap } from './worldmap.js';


const generateRadioButtonValueTranslationHandlers = (rawToFinalValueMapping, actionCallback) => {
    const result = new Map();
    rawToFinalValueMapping.forEach((finalRadioValue, originalRadioValue, map) => {
        const finalRadioValueLocal = finalRadioValue;
        function callback(event) {
            actionCallback(finalRadioValueLocal);
        }
        result.set(originalRadioValue, callback);
    });
    return result;
};

const bindRadioButtonChangeEventHandlers =
    (rootElement, radioNameToEventHandlerMapping, querySelector = "input[type='radio']") => {
    rootElement
        .querySelectorAll(querySelector)
        .forEach((radio) => {
            const eventHandlerForName = radioNameToEventHandlerMapping.get(radio.value);
            radio.addEventListener("change", eventHandlerForName);
        });
    };

class DateTimeUI {

    set rawTimeFormat(newTimeFormat) {
        this._rawTimeFormat = newTimeFormat;
        this._rebuildTimeFormat();
        this.refreshEventTimeDisplay();
    }

    get rawTimeFormat() {
        return this._rawTimeFormat;
    }

    set timeFormat(newTimeFormat) {
        throw new TypeError("Setting timeFormat directly is not allowed! Set rawTimeFormat instead!");
    }

    get timeFormat() {
        return this._timeFormat;
    }

    get rawTimeZone() {
        return this._rawTimeZone;
    }

    refreshTimeZoneDisplay(force = false) {
        this.zoneDest.innerText = `Time Zone: ${getDisplayTimeZoneString(this._rawTimeZone)}`;
    }

    _rebuildTimeFormat() {
        this._timeFormat = combineObjects(
            this._rawTimeFormat,
            { toLocaleTimeStringArgs: { 'timeZone' : this._rawTimeZone } }
        );
    }

    set rawTimeZone(newTimeZone) {
        // Only take action if we've set a new time zone
        if ( this._rawTimeZone !== newTimeZone ) {
            this._rawTimeZone = newTimeZone;
            this._rebuildTimeFormat();
            this.refreshTimeZoneDisplay()
        }
    }

    refreshEventTimeDisplay() {
        this.sunriseDest.innerText = getLocalizedTime(this.eventTimes.sunrise, this._timeFormat);
        this.sunsetDest.innerText  = getLocalizedTime(this.eventTimes.sunset , this._timeFormat);
    }

    set eventTimes(newEventTimes) {
        this._eventTimes = newEventTimes;
        this.refreshEventTimeDisplay();
    }

    get eventTimes() {
        return this._eventTimes;
    }

    calculateTimes() {
        this.sunAPI.getTimesForDate(
            (jsonData) => this.eventTimes = jsonData,
            this.worldMap.coordinates,
            this.date
        );
    }

    setDate(date = null) {
        if ( isNullOrUndefined(date) ) {
            date = new Date();
        }
        this.date = date;
        this.dateField.value = dateToFieldString();
    }

    constructor(targetElement, coordinates = null) {
        // Create API wrapper instance
        const { protocol, hostname, port } = window.location;
        this.sunAPI    = new SunAPI(`${protocol}\/\/${hostname}:${port}/api/`);

        // Set up time zone formatting & table header item
        this.zoneDest         = targetElement.querySelector("#zoneDest");
        this._rawTimeFormat   = COMMON_TIME_FORMATS.hour12;
        this._rawTimeZone     = 'UTC';
        this._timeFormat      = null;
        this._rebuildTimeFormat();

        // Storage & write destination for event times
        this._eventTimes = null;
        this.sunriseDest = targetElement.querySelector("#sunriseDest");
        this.sunsetDest  = targetElement.querySelector("#sunsetDest");

        // Set up the date field & bind date field change events
        const form          = targetElement.querySelector("#locationForm");
        const elements      = form.elements;
        this.dateField      = elements["date"];
        this.dateElement    = targetElement.querySelector('#date');
        this.setDate();

        this.dateElement.addEventListener("change", (event) => {
            this.date =  new Date(Date.parse(this.dateField.value));
            this.calculateTimes()
        });

        // Set up map & related elements
        this.longitudeField = elements["longitude"];
        this.latitudeField  = elements["latitude"];

        this.worldMap     = new WorldMap(
            targetElement.querySelector("#mapWrapper"),
            (coordinates) => {
                this.latitudeField.value = coordinates.latitude.toString();
                this.longitudeField.value = coordinates.longitude.toString();
                this.sunAPI.getTimezoneForLocation(
                    (zoneString) => { this.rawTimeZone = zoneString; },
                    coordinates
                );
                this.calculateTimes();
            }
        );

        // Bind radio buttons change events as changing this object's timeFormat value
        this.timeRadios = targetElement.querySelector("#timeRadios");
        bindRadioButtonChangeEventHandlers(
            this.timeRadios,
            generateRadioButtonValueTranslationHandlers(
                new Map([
                    ['12', COMMON_TIME_FORMATS.hour12],
                    ['24', COMMON_TIME_FORMATS.hour24]
                ]),
                (value) => this.rawTimeFormat = value
            )
        );

    }

}

export { DateTimeUI };
const ui = new DateTimeUI(document.getElementById("locationDisplay"));