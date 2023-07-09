from dateutil import parser
from typing import Annotated, Optional
from timezonefinder import TimezoneFinder

from fastapi import FastAPI, Body
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from app.models import Location, SunEventPair

# Set up the core server
app = FastAPI(title="Main app")

# API application
api = FastAPI(title="API app")

# Allows us to find a time zone for a location
tf = TimezoneFinder()


@api.post("/location/timezone/")
def api_location_zone(location: Annotated[Location, Body()]) -> Optional[str]:
    """
    Fetch the time zone for a given location, or None if no zone was found.

    :param location: A latitude, longitude location.
    :return: a time zone string or None.
    """
    return tf.timezone_at(lat=location.latitude, lng=location.longitude)


@api.post("/location/date/")
def api_location_datetime(
        location: Annotated[Location, Body()],
        datetime: Annotated[str, Body()]
) -> SunEventPair:
    """
    Return a pair of UTC events for a given location and date.

    For polar locations where the sun may not rise or set on a given
    date, `None` will be returned for any absent event.

    :param location: The location in GPS coordinates
    :param datetime: An ISO date string for the given date, including a time zone
    :return: An event pair for the given location and date
    """
    return SunEventPair.utc_for_location_and_datetime(location, parser.isoparse(datetime))


# Make the API accessible at http://hostname/api
app.mount("/api", api)

# Make static files such as CSS, JS, and the map accessible at http://hostname/static
app.mount("/static", StaticFiles(directory="static"), name="static")


# Serve the homepage at http://hostname/
@app.get("/")
def homepage():
    return FileResponse("static/index.html")
