import { normalizedToRange, isNullOrUndefined } from './helpers.js';
import { SunAPI } from './sunapi.js';
import { Coordinates } from './coordinates.js';


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


class DateTimeUI {

    calculateTimes() {
        this.sunAPI.getTimesForDate((jsonData) => {
            this.sunriseDest.innerText = jsonData["sunrise"].toString();
            this.sunsetDest.innerText = jsonData["sunset"].toString();
        },
        this.coordinates, this.date);
    }

    setDate(date = null) {
        if ( isNullOrUndefined(date) ) {
            date = new Date();
        }
        this.date = date;
        this.dateField.value = dateToFieldString();
    }

    set coordinates(coordinatesObject) {
        this.latitudeField.value = coordinatesObject.latitude.toString();
        this.longitudeField.value = coordinatesObject.longitude.toString();

        this.mapPointer.style.left = `${coordinatesObject.normalizedLongitude * 100}%`;
        this.mapPointer.style.top  = `${coordinatesObject.normalizedLatitude  * 100}%`;

        this._coordinates = coordinatesObject;
        this.calculateTimes();
    }

    get coordinates() {
        return this._coordinates;
    }

    constructor(targetElement, coordinates = null) {
        // Create API wrapper instance
        const { protocol, hostname, port } = window.location;
        this.sunAPI    = new SunAPI(`${protocol}\/\/${hostname}:${port}/api/`);

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
        this.mapWrapper   = targetElement.querySelector("#mapWrapper");
        this.mapBaseLayer = mapWrapper.querySelector("#map");
        this.mapPointer   = mapWrapper.querySelector("#cursor");

        // Center on 0, 0 if coordinates not specified
        this.coordinates  = isNullOrUndefined(coordinates) ? new Coordinates(0.0, 0.0) : coordinates;

        // Move the dot whenever the coordinates are set
        this.mapWrapper.addEventListener("click", (event) => {
            // Calculate the normalized position & set the UI's coordinates from it
            const bbox     = this.mapBaseLayer.getBoundingClientRect();
            const normLong = (event.clientX - bbox.left) / bbox.width;
            const normLat  = (event.clientY - bbox.top ) / bbox.height;

            this.coordinates = Coordinates.fromNormalized(normLat, normLong);
        });

        // Bind updates on the date field changing
        this.dateElement.addEventListener("change", (event) => {
            this.date =  new Date(Date.parse(this.dateField.value));
            this.calculateTimes()
        });

        this.calculateTimes();
    }

}

export { DateTimeUI };
const ui = new DateTimeUI(document.getElementById("locationDisplay"));