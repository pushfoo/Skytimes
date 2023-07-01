import { symmetricCheck } from "./helpers.js";

class Location {

    constructor(latitude, longitude) {
        if ( ! symmetricCheck(latitude, 90.0) ) {
            throw new TypeError("Latitude must be between -90.0 and 90.0")
        }
        if ( ! symmetricCheck(longitude, 180.0)) {
            throw new TypeError("Longitude must be between -180 and 180.0")
        }
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
export { Location };