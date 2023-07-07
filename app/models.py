from datetime import datetime as Datetime
from functools import lru_cache
from typing import Optional

from typing_extensions import Self

from pydantic import BaseModel, Field
from suntime import Sun, SunTimeException


class Location(BaseModel):
    """
    A FastAPI representation of coordinates which also performs validation.

    It is also hashable to allow for caching location objects for given GPS
    coordinates.
    """

    latitude: float = Field(ge=-90.0, le=90.0)
    longitude: float = Field(ge=-180.0, le=180.0)

    # Make it immutable & therefore hashable to allow use of lru_cache,
    # see: https://github.com/pydantic/pydantic/pull/1881
    class Config:
        frozen = True


@lru_cache
def _get_sun(location: Location) -> Sun:
    """
    Get a sun object for a given location.

    :param location: A Location model to use.
    :return: A Sun instance which can be used to calculate
    """
    return Sun(location.latitude, location.longitude)


class SunEventPair(BaseModel):
    sunrise: Optional[Datetime]
    sunset: Optional[Datetime]

    @classmethod
    def utc_for_location_and_datetime(cls, location: Location, datetime: Datetime) -> Self:
        """
        Get a pair of UTC event times for the given location and time.

        If an event does not happen on a given day, it will be set to `None`.

        :param location: The location to calculate events for.
        :param datetime: A datetime object with timezone included.
        :return:
        """
        sun = _get_sun(location)

        sunrise = None
        try:
            sunrise = sun.get_sunrise_time(datetime)
        except SunTimeException:
            pass

        sunset = None
        try:
            sunset = sun.get_sunset_time(datetime)
        except SunTimeException:
            pass

        return SunEventPair(
            sunrise=sunrise,
            sunset=sunset
        )
