import { firstLevelPropsToObj } from './helpers.js';
import { Location } from './location.js';


class SunAPI {

    structureRequest(requestLocation, date) {
        var latlon = firstLevelPropsToObj(requestLocation, "latitude", "longitude");
        return {
            location: latlon,
            datetime: this.dateISO
        };
    }

    clickTrigger() {
        const payload = this.structureRequest(this.location, this.date);
        const newUrl = this.buildEndpointURL("location", "date");
        console.log(JSON.stringify(payload));
        const request = new Request(
            newUrl,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );
        console.log("fetching " + newUrl);
        fetch(request)
            .then((response) => response.text())
            .then((text) => {
                console.log(text);
            });
        }


    buildEndpointURL(...parts) {
        return `${this.baseURL}${parts.join("/")}\/`;
    }
    constructor(targetElement) {
        // Establish base API URL
        const { protocol, hostname, port } = window.location;
        this.baseURL = `${protocol}\/\/${hostname}:${port}/api/`;

        // Filler values
        this.location  = new Location(0, 0);
        this.dateStamp = Date.now();
        this.date      = new Date(this.dateStamp);
        this.dateISO   = this.date.toISOString();
        this.targetElement = targetElement;
        targetElement.addEventListener("click", (event) => {
            console.log("trace");
            this.clickTrigger();
        });
    }
    /*
    function fillElement() {
        const body        = document.body;
        body.onclick =
        const displayArea = document.getElementById("displayArea");
        const childList   = displayArea.firstChild;

    }*/
}
const sunAPI = new SunAPI(document.getElementById("target"));