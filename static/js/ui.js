import { normalizedToRange, isNull, isNullOrUndefined } from './helpers.js';
import {
    dateToFieldString,
    getLocalizedTime,
    COMMON_TIME_FORMATS,
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

    set timeFormat(newTimeFormat) {
        this._timeFormat = newTimeFormat;
        this.refreshTimeDisplay();
    }

    get timeFormat() {
        return this._timeFormat;
    }

    refreshTimeDisplay() {
        this.sunriseDest.innerText = getLocalizedTime(this.eventTimes.sunrise, this._timeFormat);
        this.sunsetDest.innerText  = getLocalizedTime(this.eventTimes.sunset , this._timeFormat);
    }

    set eventTimes(newEventTimes) {
        this._eventTimes = newEventTimes;
        this.refreshTimeDisplay();
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

        this._timeFormat = COMMON_TIME_FORMATS.hour12;
        this._eventTimes = null;

        this.sunriseDest = targetElement.querySelector("#sunriseDest");
        this.sunsetDest  = targetElement.querySelector("#sunsetDest");

        // Set up the date field & set it to a default value
        const form          = targetElement.querySelector("#locationForm");
        const elements      = form.elements;
        this.dateField      = elements["date"];
        this.dateElement    = targetElement.querySelector('#date');

        this.longitudeField = elements["longitude"];
        this.latitudeField  = elements["latitude"];

        this.setDate();

        // Set up map elements
        this.worldMap     = new WorldMap(
            targetElement.querySelector("#mapWrapper"),
            // Center on 0, 0 if coordinates not specified
            new Coordinates(0,0),
            (coordinates) => {
                this.latitudeField.value = coordinates.latitude.toString();
                this.longitudeField.value = coordinates.longitude.toString();
                this.calculateTimes();
            }
        );
        this.calculateTimes();

        // Bind updates on the date field changing
        this.dateElement.addEventListener("change", (event) => {
            this.date =  new Date(Date.parse(this.dateField.value));
            this.calculateTimes()
        });

        // Bind radio buttons change events as changing this object's timeFormat value
        this.timeRadios = targetElement.querySelector("#timeRadios");
        bindRadioButtonChangeEventHandlers(
            this.timeRadios,
            generateRadioButtonValueTranslationHandlers(
                new Map([
                    ['12', COMMON_TIME_FORMATS.hour12],
                    ['24', COMMON_TIME_FORMATS.hour24]
                ]),
                (value) => this.timeFormat = value
            )
        );

    }

}

export { DateTimeUI };
const ui = new DateTimeUI(document.getElementById("locationDisplay"));