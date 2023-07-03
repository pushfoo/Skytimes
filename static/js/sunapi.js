import { isNullOrUndefined } from './helpers.js';
import { Coordinates } from './coordinates.js';


class SunAPI {

    structureRequest(coordinates, date) {
        return {
            location: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            },
            datetime: date.toISOString()
        };
    }

    getTimesForDate(handlerCallback, coordinates, date = null) {
        const payload = this.structureRequest(
            coordinates, isNullOrUndefined(date) ? new Date() : date
            );
        console.log(JSON.stringify(payload));
        const request = new Request(
            this.locationDateEndpoint,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );
        console.log("fetching " + this.locationDateEndpoint);

        fetch(request)
            .then((response) => response.json() )
            .then(handlerCallback);
    }

    buildEndpointURL(...parts) {
        return `${this.baseURL}${parts.join("/")}\/`;
    }

    constructor(baseURL) {
        this.baseURL = baseURL;
        this.locationDateEndpoint = this.buildEndpointURL("location", "date");
    }

}

export { SunAPI };