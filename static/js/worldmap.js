import { isNull } from './helpers.js';
import { Coordinates } from './coordinates.js';

export const name = "worldmap";


/**
 * A dummy callback which logs the latitude and longitude of Coordinates to console.
 * @param {Coordinates} coordinates - coordinates which will be logged to console.
 **/
const loggingClickHandler = (coordinates) => {
    console.log(`Map clicked at (${coordinates.longitude}, ${coordinates.latitude})`);
}


/**
 * A world map object. It assumes its width and height will never be 0.
 **/
class WorldMap {

    get coordinates() {
        return this._coordinates;
    }

    /**
     * Set the coordinates to a new coordinate object & update the map position.
     * @param {Coordinates} newCoordinates - the new coordinates.
     **/
    set coordinates(newCoordinates) {
        this._dotElement.style.top  = `${(1.0 - newCoordinates.normalizedLatitude ) * 100}%`
        this._dotElement.style.left = `${       newCoordinates.normalizedLongitude  * 100}%`;
        this._coordinates = newCoordinates;
    }

    /**
     * Construct a map which converts clicks to Coordinates objects & calls the click handler if set.
     *
     * @param {String|HTMLElement} target - a query selector or direct HTML element wrapping a map & pointer.
     * @param {function} clickCoordinateCallback - a function which takes a Coordinates object as an argument.
     **/
    constructor(target, coordinates = null, clickCoordinateCallback = null) {
        // Use strings as selector queries
        if ( target instanceof String ) {
            this._wrapperElement = document.querySelector(target);
            if ( isNull(this._wrapperElement) ) {
                throw new TypeError(`Could not find an element matching "${target}"`);
            }
        }
        // Assume anything else is the HTMLElement of the wrapper div
        else {
            this._wrapperElement = target;
        }
        this._mapElement = this._wrapperElement.querySelector(':nth-child(1)');
        this._dotElement = this._wrapperElement.querySelector(':nth-child(2)');

        // Default to the middle of the map if no coordinates specified
        this.coordinates = isNull(coordinates) ? new Coordinates(0.0, 0.0) : coordinates

        this.clickCoordinateCallback = clickCoordinateCallback;

        this._wrapperElement.addEventListener("click", (event) => {

            const bbox     = this._wrapperElement.getBoundingClientRect();
            const normLat  = 1.0 - (event.clientY - bbox.top ) / bbox.height;
            const normLong =       (event.clientX - bbox.left) / bbox.width;

            this.coordinates = Coordinates.fromNormalized(normLat, normLong);

            if ( ! isNull(this.clickCoordinateCallback) ) {
                this.clickCoordinateCallback(this._coordinates);
            }

        });

    }

}

export { WorldMap, loggingClickHandler };