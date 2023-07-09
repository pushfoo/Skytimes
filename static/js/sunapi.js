import { isNull, isNullOrUndefined, firstLevelPropsToObj } from './helpers.js';
import { Coordinates } from './coordinates.js';


const buildPOSTRequest = (endpoint, object) => {
    const request = new Request(
        endpoint,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(object)
        }
    );
    return request;
}

class SunAPI {

    getTimesForDate(handlerCallback, coordinates, date = null) {

        const request = buildPOSTRequest(
            this.locationDateEndpoint,
            {
                location: firstLevelPropsToObj(coordinates, "latitude", "longitude"),
                datetime: (isNullOrUndefined(date) ? new Date() : date).toISOString()
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