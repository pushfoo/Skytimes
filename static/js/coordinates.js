import { symmetricCheck } from "./helpers.js";

/* A pair of latitude, longitude coordinates with validation baked in.
 *
 * Attempting to set an invalid value will throw a TypeError.
 */
class Coordinates {

    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    get latitude() {
        return this._latitude;
    }
    set latitude(newLatitude) {
         if ( ! symmetricCheck(newLatitude, 90.0) ) {
            throw new TypeError("Latitude must be between -90.0 and 90.0")
        }
        this._latitude = newLatitude;
    }
    get longitude() {
        return this._longitude;
    }
    set longitude(newLongitude) {
        if ( ! symmetricCheck(newLongitude, 180.0)) {
            throw new TypeError("Longitude must be between -180 and 180.0")
        }
        this._longitude = newLongitude;
    }
}

export { Coordinates };