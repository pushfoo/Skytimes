/** @module coordinates */

export const name = 'coordinates';

import {
    isNullOrUndefined,
    symmetricCheck,
    normalizedToRange,
    rangeToNormalized,
    isProperNormalized
} from "./helpers.js";


const MIN_LATITUDE  =  -90.0;
const MAX_LATITUDE  =   90.0;
const MIN_LONGITUDE = -180.0;
const MAX_LONGITUDE =  180.0;

/**
 * Convert from a normalized latitude of 0.0 South through 1.0 North to a regular form latitude.
 * @param {number} normalizedLatitude - The normalized latitude from 0.0 South through 1.0 North.
 **/
const normalizedLatitudeToRegular = (normalizedLatitude) => {
    if ( ! isProperNormalized(normalizedLatitude) ) {
        throw new TypeError("Normalized latitude must be between 0.0 and 1.0");
    }
    return normalizedToRange(normalizedLatitude, MIN_LATITUDE, MAX_LATITUDE);
};

/**
 * Convert from a normalized longitude of 0.0 West through 1.0 East to a regular form latitude.
 * @param {number} normalizedLongitude - The normalized longitude from 0.0 South through 1.0 North.
 **/
const normalizedLongitudeToRegular = (normalizedLongitude) => {
    if ( ! isProperNormalized(normalizedLongitude) ) {
        throw new TypeError("Normalized longitude must be between 0.0 and 1.0");
    }
    return normalizedToRange(normalizedLongitude, MIN_LONGITUDE, MAX_LONGITUDE);
};


/** Latitude & longitude coordinates with built-in validation & normalized form. **/
class Coordinates {

    /**
     * Create a Coordinates object from either regular or normalized values.
     *
     * @param (number} - The latitude in regular or normalized form
     * @param {number} - The latitude in regular of normalized formn
     * @param {boolean} valuesAreNormalized - Whether the passed coordinates are normalized
     **/
    constructor(latitude, longitude, valuesAreNormalized = false) {
        if ( valuesAreNormalized === true ) {
            this.normalizedLatitude = latitude;
            this.normalizedLongitude = longitude;
        } else {
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }

    /**
     * Get the latitude as a regular value from -90.0 South to 90.0 North.
     * @returns {number} The regular latitude.
     **/
    get latitude() {
        return this._latitude;
    }

    /**
     * Get the normalized latitude, ie from 0.0 South to 1.0 North.
     * @returns {number} - The normalized latitude
     **/
    get normalizedLatitude() {
        return this._normalizedLatitude;
    }

    /**
     * Set the latitude to a regular value between -90.0 South to 90.0 North.
     * @param {number} newLatitude - The desired new latitude.
     **/
    set latitude(newLatitude) {
        if ( ! symmetricCheck(newLatitude, MAX_LATITUDE) ) {
            throw new TypeError("Latitude must be between -90.0 and 90.0")
        }
        this._latitude = newLatitude;
        this._normalizedLatitude = rangeToNormalized(newLatitude, MIN_LATITUDE, MAX_LATITUDE);
    }

    /**
     * Set the latitude from a normalized value between 0.0 South to 1.0 North.
     * @param {number} newNormalizedLatitude - The desired new normalized latitude.
     **/
    set normalizedLatitude(newNormalizedLatitude) {
        this._latitude = normalizedLatitudeToRegular(newNormalizedLatitude);
        this._normalizedLatitude = newNormalizedLatitude;
    }

    /**
     * Get the longitude as a regular value from -180.0 West to 180.0 East.
     * @returns {number} The regular form longitude.
     **/
    get longitude() {
        return this._longitude;
    }

    /**
     * Get the normalized longitude from 0.0 West to 1.0 East.
     * @returns {number} The normalized longitude.
     **/
    get normalizedLongitude() {
        return this._normalizedLongitude;
    }

    /**
     * Set the longitude from a normalized value between 0.0 West to 1.0 East.
     * @param {number} newNormalizedLongitude - The desired new normalized longitude.
     **/
    set normalizedLongitude(newNormalizedLongitude) {
        this._longitude = normalizedLongitudeToRegular(newNormalizedLongitude);
        this._normalizedLongitude = newNormalizedLongitude;
    }

    /**
     * Set the longitude to a regular value between -180.0 West to 90.0 East.
     * @param {number} newLatitude - The desired new regular longitude.
     **/
    set longitude(newLongitude) {
        if ( ! symmetricCheck(newLongitude, MAX_LONGITUDE)) {
            throw new TypeError("Longitude must be between -180 and 180.0")
        }
        this._longitude = newLongitude;
        this._normalizedLongitude = rangeToNormalized(newLongitude, MIN_LONGITUDE, MAX_LONGITUDE);
    }

    /**
     * A short-form static helper which creates a Coordinates from normalized values.
     * @param {number} normalizedLatitude - The latitude as a normalized value from 0.0 South to 1.0 North.
     * @param {number} normalizedLongitude - The longitude as a normalized value from 0.0 West to 1.0 East.
     **/
    static fromNormalized(normalizedLatitude, normalizedLongitude) {
        return new Coordinates(normalizedLatitude, normalizedLongitude, true);
    }

    toJSON() {
        return {
            latitude: this._latitude,
            longitude: this._longitude
        };
    }
}

export { Coordinates };