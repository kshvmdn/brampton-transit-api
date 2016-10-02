## brampton-transit-api [![Build Status](https://travis-ci.org/kshvmdn/brampton-transit-api.svg?branch=master)](https://travis-ci.org/kshvmdn/brampton-transit-api)

> An unofficial API for retrieving live Brampton Transit bus times.

Live at [http://transit.kshvmdn.com](http://transit.kshvmdn.com) (give it a few seconds to spin up, it's running on Heroku's free tier).

### Design

The project is a constant work in progress. The `v0` API is essentially a dump of data scraped in real-time. This obviously isn't too great of a structure for an API like this, particularly when requesting a large dataset (i.e. `api/v0/routes`). A future implementation _may_ include some sort of data store or caching mechanism.

#### Scrapers

- Built with the glorious [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) Python library.
- Data source: Brampton Transit Next Ride ([desktop](http://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/NextRide.aspx), [mobile](http://nextride.brampton.ca/mob/SearchBy.aspx)).

### Endpoints

__<a name="api-routes">`/api/v0/routes`</a>__

- Fetch a list of Brampton Transit routes (see [_Find By Route_](http://nextride.brampton.ca/RealTime.aspx)).
- Sample response:

  ```js
  {
    "data": [
      {
        "route_name": "Queen, West",
        "route": "1"
      },
      {
        "route_name": "Queen, East",
        "route": "1"
      },
      {
        "route_name": "Main, South",
        "route": "2"
      },
      ...
    ],
    "meta": {
      "message": "OK",
      "status": 200
    }
  }
  ```
  
__`/api/v0/search/stops/<query>`__

- Search for a list of stops using `query`.
- Sample response:

  ```js
  // /api/v0/stops/search/bramalea
  {
    "data": [
      {
        "stop": "1113",
        "stop_name": "Bramalea - Zum Steeles Station Stop"
      },
      {
        "stop": "1114",
        "stop_name": "Steeles Ave E at Bramalea GO Statio"
      },
      {
        "stop": "1150",
        "stop_name": "Kensington Rd opp Bramalea Medical"
      },
      ...
    ],
    "meta": {
      "message": "OK",
      "status": 200
    }
  }
  ```

__`/api/v0/stops`__

- Fetch a list of Brampton Transit stops (separated by [route](#api-routes), see [_Find By Route_](http://nextride.brampton.ca/RealTime.aspx)).
- `stops` are sorted by order of occurence. Add `?sort=1` to sort by integer value.
- Sample response:

  ```js
  {
    "data": [
      {
        "route": "1",
        "route_name": "Queen, West",
        "stops": [
          {
            "stop": "4035",
            "stop_name": "Highway 50 - Zum Queen Station Stop"
          },
          {
            "stop": "2543",
            "stop_name": "The Gore Rd n/of Queen St E"
          },
          {
            "stop": "2544",
            "stop_name": "The Gore Rd s/of Fogal Rd"
          },
          ...
        ]
      },
      {
        "route": "1",
        "route_name": "Queen, East",
        "stops": [
          {
            "stop": "2315",
            "stop_name": "Mount Pleasant GO Station - Route 1"
          },
          {
            "stop": "2807",
            "stop_name": "Bovaird - Zum Queen West Station St"
          },
          {
            "stop": "1007",
            "stop_name": "Williams - Zum Queen West Station S"
          },
          ...
        ]
      },
      ...
    ],
    "meta": {
      "message": "OK",
      "status": 200
    }
  }
  ```
  
__`/api/v0/stops/<route_id>`__

- Fetch a list of Brampton Transit stops for a single route.
- `stops` are sorted by order of occurence. Add `?sort=1` to sort by integer value.
- Sample response:
  
  ```js
  // /api/v0/stops/511
  {
    "data": [
      {
        "route": "511",
        "route_name": "Zum Steeles, West",
        "stops": [
          {
            "stop": "4227",
            "stop_name": "Humber College Terminal- Zum Steele"
          },
          {
            "stop": "4112",
            "stop_name": "Finch - Zum Steeles Station Stop WB"
          },
          {
            "stop": "1080",
            "stop_name": "Goreway - Zum Steeles Station Stop "
          },
          ...
        ]
      }
    ],
    "meta": {
      "message": "OK",
      "status": 200
    }
  }
  ```

__`/api/v0/stop/<stop_id>`__

- Fetch a list of times for a given stop.
- Add `?c=1` to merge `times` for matching routes.
- Sample response:

  ```js
  // /api/v0/stop/1080
  {
    "data": {
      "stop": "1080",
      "stop_name": "Goreway - Zum Steeles Station Stop",
      "routes": [
        {
          "route": "511",
          "direction": "Zum Steeles WB",
          "times": [
            "12:15 PM"
          ]
        },
        {
          "route": "11",
          "direction": "Steeles WB-11A",
          "times": [
            "12:24 PM"
          ]
        },
        {
          "route": "511",
          "direction": "Zum Steeles WB",
          "times": [
            "12:35 PM"
          ]
        },
        {
          "route": "11",
          "direction": "Steeles WB",
          "times": [
            "12:54 PM"
          ]
        },
        {
          "route": "511",
          "direction": "Zum Steeles WB",
          "times": [
            "12:55 PM"
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

  ```js
  // /api/v0/stop/1080?c=1
  {
    "data": {
      "stop": "1080",
      "stop_name": "Goreway - Zum Steeles Station Stop",
      "routes": [
        {
          "route": "511",
          "direction": "Zum Steeles WB",
          "times": [
            "12:15 PM",
            "12:35 PM",
            "12:55 PM"
          ]
        },
        {
          "route": "11",
          "direction": "Steeles WB-11A",
          "times": [
            "12:24 PM"
          ]
        },
        {
          "route": "11",
          "direction": "Steeles WB",
          "times": [
            "12:54 PM"
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

### Self-hosting

#### Requirements

- [Python 3](https://www.python.org/download/releases/3.0/)

#### Installation

- Clone repository.

  ```sh
  $ git clone https://github.com/kshvmdn/brampton-transit-api.git brampton-transit-api && cd $_
  ```

- Install Python dependencies.

  ```sh
  $ pip install -r ./requirements.txt
  ```

- Start the server.

  ```sh
  $ PORT=<port> HOST=<host> DEBUG=<True|False> ./app.py
  ```

### Contribute

This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) or [submit a PR](https://github.com/kshvmdn/next-ride-api/pulls). Refer to the [self-hosting](#self-hosting) guide to get started.

Before submitting a PR, please ensure your changes comply with the [PEP 8](https://www.python.org/dev/peps/pep-0008/) standard for Python code.

### License

[MIT](LICENSE) © [Kashav Madan](http://kshvmdn.com).
