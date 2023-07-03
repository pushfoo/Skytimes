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

const normalizedLatitudeToRegular = (normalizedLatitude) => {
    if ( ! isProperNormalized(normalizedLatitude) ) {
        throw new TypeError("Normalized latitude must be between 0.0 and 1.0");
    }
    return normalizedToRange(normalizedLatitude, MIN_LATITUDE, MAX_LATITUDE);
};

const normalizedLongitudeToRegular = (normalizedLongitude) => {
    if ( ! isProperNormalized(normalizedLongitude) ) {
        throw new TypeError("Normalized longitude must be between 0.0 and 1.0");
    }
    return normalizedToRange(normalizedLongitude, MIN_LONGITUDE, MAX_LONGITUDE);
};


//TODO: double-check this for weird rounding edge cases
/* A pair of latitude, longitude coordinates with validation baked in.
 *
 * Attempting to set an invalid value will throw a TypeError.
 */
class Coordinates {

    constructor(latitude, longitude, valuesAreNormalized = false) {
        if ( valuesAreNormalized === true ) {
            this.normalizedLatitude = latitude;
            this.normalizedLongitude = longitude;
        } else {
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }

    get latitude() {
        return this._latitude;
    }

    get normalizedLatitude() {
        return this._normalizedLatitude;
    }

    set latitude(newLatitude) {
        if ( ! symmetricCheck(newLatitude, MAX_LATITUDE) ) {
            throw new TypeError("Latitude must be between -90.0 and 90.0")
        }
        this._latitude = newLatitude;
        this._normalizedLatitude = rangeToNormalized(newLatitude, MIN_LATITUDE, MAX_LATITUDE);
    }

    set normalizedLatitude(newNormalizedLatitude) {
        this._latitude = normalizedLatitudeToRegular(newNormalizedLatitude);
        this._normalizedLatitude = newNormalizedLatitude;
    }

    get longitude() {
        return this._longitude;
    }

    get normalizedLongitude() {
        return this._normalizedLongitude;
    }

    set normalizedLongitude(newNormalizedLongitude) {
        this._longitude = normalizedLongitudeToRegular(newNormalizedLongitude);
        this._normalizedLongitude = newNormalizedLongitude;
    }

    set longitude(newLongitude) {
        if ( ! symmetricCheck(newLongitude, MAX_LONGITUDE)) {
            throw new TypeError("Longitude must be between -180 and 180.0")
        }
        this._longitude = newLongitude;
        this._normalizedLongitude = rangeToNormalized(newLongitude, MIN_LONGITUDE, MAX_LONGITUDE);
    }

    static fromNormalized(normalizedLatitude, normalizedLongitude) {
        return new Coordinates(normalizedLatitude, normalizedLongitude, true);
    }
}

export { Coordinates };