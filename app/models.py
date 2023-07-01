from datetime import datetime as Datetime
from functools import lru_cache
from typing import Dict, Optional

from typing_extensions import Self

from pydantic import BaseModel, Field
from suntime import Sun, SunTimeException


class Location(BaseModel):
    latitude: float = Field(ge=-90.0, le=90.0)
    longitude: float = Field(ge=-180.0, le=180.0)

    # Make it immutable & therefore hashable to allow use of lru_cache,
    # see: https://github.com/pydantic/pydantic/pull/1881
    class Config:
        frozen = True


@lru_cache
def get_sun(location: Location) -> Sun:
    """
    Cached sun objects

    :param location:
    :return:
    """
    return Sun(location.latitude, location.longitude)


class SunEventPair(BaseModel):
    sunrise: Optional[Datetime]
    sunset: Optional[Datetime]

    @classmethod
    def at_location_and_time(cls, location: Location, datetime: Datetime) -> Self:
        sun = get_sun(location)

        sunrise = None
        try:
            sunrise = sun.get_sunrise_time(datetime)
        except SunTimeException as e:
            pass

        sunset = None
        try:
            sunset = sun.get_sunset_time(datetime)
        except SunTimeException as e:
            pass

        return SunEventPair(
            sunrise=sunrise,
            sunset=sunset
        )


class SunEventTimes(BaseModel):
    datetimes: Dict[Datetime, SunEventPair]
