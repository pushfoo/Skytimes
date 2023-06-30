from datetime import datetime as Datetime
from functools import lru_cache
from typing import Dict

from typing_extensions import Self

from pydantic import BaseModel, Field
from suntime import Sun


class Location(BaseModel):
    latitude: float = Field(ge=-90.0, le=90.0)
    longitude: float = Field(ge=-180.0, le=180.0)

    # Make it hashable to allow use of lru_cache, see:
    # https://github.com/pydantic/pydantic/pull/1881
    class Config:
        frozen = True


@lru_cache
def get_sun(location: Location) -> Sun:
    """
    Cached sun object getter.

    :param location:
    :return:
    """
    return Sun(location.latitude, location.longitude)


class SunEventPair(BaseModel):
    sunrise: Datetime
    sunset: Datetime

    @classmethod
    def at_location_and_time(cls, location: Location, datetime: Datetime) -> Self:
        sun = get_sun(location)
        return SunEventPair(
            sunrise=sun.get_sunrise_time(datetime),
            sunset=sun.get_sunset_time(datetime)
        )


class SunEventTimes(BaseModel):
    datetimes: Dict[Datetime, SunEventPair]
