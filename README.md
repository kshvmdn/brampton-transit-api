# next-ride-api [![Build Status](https://travis-ci.org/kshvmdn/next-ride-api.svg?branch=master)](https://travis-ci.org/kshvmdn/next-ride-api)

A scraper and web API for Brampton Transit's [Next Ride](http://nextride.brampton.ca/) service.

### Scraper

- Data source: Next Ride [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx).
- Located at [`lib/scraper`](lib/scraper).

### Usage

#### Requirements

- [Node.js](https://nodejs.org/en/) (`6.x.x`)
- [Python](https://www.python.org/download/releases/3.0/) (`3.x`)

#### Getting started

- Clone/[download](https://github.com/kshvmdn/next-ride-api/archive/master.zip) the repository.

  ```sh
  $ git clone https://github.com/kshvmdn/next-ride-api.git
  ```
  
- Install Python requirements + Node dependencies.

  ```sh
  $ pip install -r ./lib/scraper/requirements.txt && npm install
  ```

- Start the Node application. It'll be running at [`http://localhost:3001`](http://localhost:3001) (or your environment-defined `PORT` & `ADDRESS`).

  ```sh
  $ npm run build-scss && npm start
  ```

#### API

- `/api/stop`

  + Retrieve a list of all stops, separated by route.
  + Data is scraped periodically via [`scrapers/stop_list.py`](lib/scraper/scrapers/stop_list.py).
    
    ```js
    // http://localhost:3001/api/stop
    {
      "data": [
        {
          "route": {
            "number": "1",
            "name": "Queen, West"
          },
          "stops": [
            {
              "code": "4035",
              "name": "Highway 50 - Zum Queen Station Stop"
            },
            {
              "code": "4036",
              "name": "The Gore Road - Zum Queen Station S"
            },
            {
              "code": "2881",
              "name": "Queen St E w/of Palleschi Dr"
            },
            ...
          ]
        },
        ...
      ],
      "meta": {
        "status": 200,
        "message": "OK"
      }
    }
    ```

- `/api/stop/:stop`

  + Retrieve the schedule for the given `stop` value (refer to `/apistop` for the list of possible values).
  + Data is scraped in real-time via [`scrapers/single_stop.py`](lib/scraper/scrapers/single_stop.py).
  + Sample output:
    
    ```js
    // http://localhost:3001/api/stop/4036
    {
      "data": {
        "stop": {
          "id": "4036",
          "name": "The Gore Road - Zum Queen Station S"
        },
        "routes": [
          {
            "direction": "Zum Queen WB",
            "route": "501",
            "times": [
              "5 min(s)",
              "11:27 AM"
            ]
          },
          {
            "direction": "Queen WB",
            "route": "1",
            "times": [
              "11:05 AM",
              "11:35 AM"
            ]
          },
          {
            "direction": "Zum Queen WB-407",
            "route": "501",
            "times": [
              "11:09 AM"
            ]
          }
        ]
      },
      "meta": {
        "status": 200,
        "message": "OK"
      }
    }
    ```

### Contribute

This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) / [make a PR](https://github.com/kshvmdn/next-ride-api/pulls) with questions/requests/features/fixes.
