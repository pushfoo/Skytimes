from datetime import datetime as Datetime
from typing import Annotated

from fastapi import FastAPI, Body
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from app.models import Location, SunEventPair

api = FastAPI(title="API app")


@api.post("/api/location/date/")
def api_location_both(
        location: Annotated[Location, Body()],
        datetime: Annotated[Datetime, Body()]
) -> SunEventPair:
    """
    Return a single sun event pair for location on a given date

    :param location: The location in GPS coordinates
    :param datetime: A datetime object for the given day
    :return:
    """
    return SunEventPair.at_location_and_time(location, datetime)


app = FastAPI(title="Main app")
app.mount("/api", api)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def homepage():
    return FileResponse("static/index.html")
