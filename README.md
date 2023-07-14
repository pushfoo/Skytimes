# Skytimes

A minimal web application which calculates sunset & sunrise times for
locations around the world. The front end communicates with the API 
via JSON fetch requests.

I haven't decided on a license for this project at the moment.

## Project Goals

- [x] Demonstrate practical knowledge of HTML, CSS, XML, and JSON
- [x] Try [FastAPI](https://fastapi.tiangolo.com/)
- [x] Learn about modern JavaScript techniques

## Screenshot

![A screenshot of the project](doc/desktop_screenshot.png)

## Usage

First, have Python 3.9 or greater installed with a working pip.
3.8 may work as well, but it has not been tested. Then, clone
this repository locally and do the following:

1. `pip install .`
2. Launch the backend with `uvicorn app:app --reload`
3. Open https://localhost:8000/ in your browser

Mac & Linux users can use `./launch.sh` as shorthand to launch the application.

## Asset Credits
| Component                 | License       | Project or Source URL                                                      |
|---------------------------|---------------|----------------------------------------------------------------------------|
| Equirectilinear World Map | Public Domain | https://upload.wikimedia.org/wikipedia/commons/a/ac/World_location_map.svg |
