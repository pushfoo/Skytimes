import { normalizedToRange, isNull, isNullOrUndefined } from './helpers.js';
import { SunAPI } from './sunapi.js';
import { Coordinates } from './coordinates.js';
import { WorldMap } from './worldmap.js';


const intToZeroPaddedString = (sourceInt, numZeroesOnLeft) => {
    const rawOneIndexedStr = sourceInt.toString();
    if ( rawOneIndexedStr.length > numZeroesOnLeft ) {
        throw new TypeError("Passed string longer than goal length!");
    }
    return rawOneIndexedStr.padStart(numZeroesOnLeft, "0");
};

const dateToFieldString = (date) => {
    if ( isNullOrUndefined(date) ) {
        date = new Date();
    }
    const base = [
        intToZeroPaddedString(date.getFullYear() , 4),
        intToZeroPaddedString(date.getMonth() + 1, 2),
        intToZeroPaddedString(date.getDate()     , 2)
    ];
    return base.join("-");
};

const getHourMinString = (dateTime, use12Hour = true, onNullMessage = 'N/A') => {
    if ( isNull(dateTime) ) {
        return onNullMessage;
    }
    else {
        return dateTime
            .toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: use12Hour, timeZone: 'UTC'})
            .toUpperCase();
    }
};

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

    set use12Hour(use12HourBool) {

        if ( typeof use12HourBool != "boolean" ) {
            throw new TypeError("use12HourBool must be a boolean value");
        }
        this._use12Hour = use12HourBool;
        this.refreshTimeDisplay();
    }

    get use12Hour() {
        return this._use12Hour;
    }

    refreshTimeDisplay() {
           this.sunriseDest.innerText = getHourMinString(this.eventTimes.sunrise, this._use12Hour);
           this.sunsetDest.innerText  = getHourMinString(this.eventTimes.sunset, this._use12Hour);
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

        this._use12Hour  = true;
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

        // Bind update events for radio buttons
        this.timeRadios = targetElement.querySelector("#timeRadios");
        bindRadioButtonChangeEventHandlers(
            this.timeRadios,
            generateRadioButtonValueTranslationHandlers(
                new Map([['12', true], ['24', false]]),
                (value) => this.use12Hour = value
            )
        );

    }

}

export { DateTimeUI };
const ui = new DateTimeUI(document.getElementById("locationDisplay"));