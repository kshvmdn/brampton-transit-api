## brampton-transit-api [![Build Status](https://travis-ci.org/kshvmdn/brampton-transit-api.svg?branch=master)](https://travis-ci.org/kshvmdn/brampton-transit-api)

> An unofficial API for retrieving live Brampton Transit bus times.

### Scraper

- Data source: [Next Ride](http://nextride.brampton.ca/mob/SearchBy.aspx).

### Usage

#### Requirements

- [Node.js](https://nodejs.org/en/) (`^6`)
- [Python 3](https://www.python.org/download/releases/3.0/)

#### Getting started

- Clone/[download](https://github.com/kshvmdn/next-ride-api/archive/master.zip) the repository.

  ```sh
  $ git clone https://github.com/kshvmdn/brampton-transit-api.git
  ```
  
- Install Python / Node dependencies.

  ```sh
  $ pip install -r requirements.txt && npm install
  ```

- Start the Node server. It'll be running at [`localhost:3001`](http://localhost:3001) (or your environment-defined `HOST` & `PORT`).

  ```sh
  $ HOST=host PORT=port npm start
  ```

#### API

- `/api/stops`

  + Retrieve a list of all stops, separated by route.
    
    ```js
    // http://localhost:3001/api/stops
    {
      "data": [
        {
          "name": "Queen, West",
          "number": "1",
          "stops": [
            {
              "stop_code": "4035",
              "stop_name": "Highway 50 - Zum Queen Station Stop"
            },
            {
              "stop_code": "2543",
              "stop_name": "The Gore Rd n/of Queen St E"
            },
            {
              "stop_code": "2544",
              "stop_name": "The Gore Rd s/of Fogal Rd"
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

  + Retrieve the schedule for the given `stop` value (refer to `/api/stop` for the list of all possible values).
  + Data is scraped in __real-time__.
  + Sample output:
    
    ```js
    // http://127.0.0.1:3001/api/stop/4035
    {
      "data": {
        "stop": "4035",
        "stop_name": "Highway 50 - Zum Queen Station Stop",
        "routes": [
          {
            "route": "501",
            "direction": "Zum Queen WB",
            "times": [
              "6 min(s)",
              "11:10 PM"
            ]
          },
          {
            "route": "23",
            "direction": "Sandalwood WB",
            "times": [
              "10:51 PM"
            ]
          },
          {
            "route": "1",
            "direction": "Queen WB",
            "times": [
              "10:52 PM"
            ]
          },
          {
            "route": "501",
            "direction": "Zum Queen WB-407",
            "times": [
              "10:55 PM"
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

This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) or [submit a PR](https://github.com/kshvmdn/next-ride-api/pulls).

Before submitting a PR, please ensure your changes comply with:

  - [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python;
  - [Standard](https://github.com/feross/standard) for JavaScript (you can test this by running `npm run lint`)
