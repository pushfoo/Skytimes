from datetime import datetime as Datetime
from typing import Annotated, Tuple

from fastapi import FastAPI, Body

from models import Location, SunEventPair

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/api/location/date/")
def api_location_both(
        location: Annotated[Location, Body()],
        datetime: Annotated[Datetime, Body()]
) -> Tuple[Datetime, Datetime]:
    """
    Return a single sun event pair for location on a given date

    :param location: The location in GPS coordinates
    :param datetime: A datetime object for the given day
    :return:
    """
    return SunEventPair.at_location_and_time(location, datetime)
