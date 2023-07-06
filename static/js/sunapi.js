import { isNull, isNullOrUndefined } from './helpers.js';
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
            // deserialize JSON to an actual object
            .then((response) => response.json())
            // map raw date strings to Date objects
            .then((data) => Object
                .fromEntries(Object.entries(data)
                .map(([k,v]) => [k, isNull(v) ? null : new Date(v)]))
            )
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