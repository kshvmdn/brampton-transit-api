# brampton-transit-api [![Build Status](https://travis-ci.org/kshvmdn/brampton-transit-api.svg?branch=master)](https://travis-ci.org/kshvmdn/brampton-transit-api)

> An unofficial API for retrieving live Brampton Transit bus times.

Live at [http://transit.kshvmdn.com](http://transit.kshvmdn.com) (might take a few seconds to spin up, it's running on Heroku's free tier).

__Data source__: Brampton Transit Next Ride ([desktop](http://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/NextRide.aspx), [mobile](http://nextride.brampton.ca/mob/SearchBy.aspx)).

- [Usage](#usage)
  + [Endpoints](#endpoints)
  + [Hosting / Running](#hosting--running)
- [Contribute](#contribute)
- [License](#license)

---

## Usage

### Endpoints

  - [`/routes`](http://transit.kshvmdn.com/api/v1/routes)

    + Retrieve a list of routes. __Optionally__ filter by route code or name.

    + Optional query parameters:
      * `code` - Route code
      * `name` - Route name (case insensitive)

    + Examples:

      * [`/routes`](http://transit.kshvmdn.com/api/v1/routes)

        ```js
        {
          "data": [
            {
              "route": "1",
              "route_name": "Queen, West"
            },
            {
              "route": "1",
              "route_name": "Queen, East"
            },
            ...
          ],
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

      * [`/routes?code=2`](http://transit.kshvmdn.com/api/v1/routes?code=2)

        ```js
        {
          "data": [
            {
              "route": "2",
              "route_name": "Main, South"
            },
            {
              "route": "2",
              "route_name": "Main, North"
            }
          ],
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

      * [`/routes?name=bramalea`](http://transit.kshvmdn.com/api/v1/routes?name=bramalea)

          ```js
          {
            "data": [
              {
                "route": "15",
                "route_name": "Bramalea, South"
              },
              {
                "route": "15",
                "route_name": "Bramalea, North"
              },
              {
                "route": "92",
                "route_name": "Bramalea GO Shuttle, South"
              },
              {
                "route": "92",
                "route_name": "Bramalea GO Shuttle, North"
              }
            ],
            "status": {
              "code": 200,
              "message": "OK"
            }
          }
          ```

  - [`/stops`](http://transit.kshvmdn.com/api/v1/stops)

    + Retrieve a list of all stops separated by route.

    + Examples:

      * [`/stops`](http://transit.kshvmdn.com/api/v1/stop)

        ```js
        {
          "data": [
            {
              "route_id": "1004",
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
                ...
              ]
            },
            {
              "route_id": "1001",
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
                ...
              ]
            },
            ...
          ],
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

  - [`/stops/route`](http://transit.kshvmdn.com/api/v1/routes)

    + Retrieve a list of stops filtered by __route__. If you wish to retrieve all stops, use [`/stops`](#stops) instead. 

    + Query parameters:
      + `code` - Route code
      + `name` - Route name (case insensitive)

    + Examples:

      * [`/stops/route`](http://transit.kshvmdn.com/api/v1/stops/route)

        ```js
        {
          "error": {
            "code": 400,
            "message": "Expected at least one parameter."
          }
        }
        ```

      * [`/stops/route?name=torbram`](http://transit.kshvmdn.com/api/v1/stops/route?name=torbram)

        ```js
        {
          "data": [
            {
              "route_id": "14003",
              "route": "14",
              "route_name": "Torbram, South",
              "stops": [
                {
                  "stop": "3498",
                  "stop_name": "Torbram Rd s/of Father Tobin Rd"
                },
                {
                  "stop": "3499",
                  "stop_name": "Torbram Rd at Australia Dr"
                },
                ...
              ]
            },
            {
              "route_id": "14002",
              "route": "14",
              "route_name": "Torbram, North",
              "stops": [
                {
                  "stop": "6157",
                  "stop_name": "Westwood Mall Terminal Route 14 Sto"
                },
                {
                  "stop": "6004",
                  "stop_name": "Goreway Rd s/of Morning Star Dr"
                },
                ...
              ]
            }
          ],
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

  - [`/stops/stop`](http://transit.kshvmdn.com/api/v1/routes)

    + Retrieve a list of stops filtered by __stop__. If you wish to retrieve all stops, use [`/stops`](#stops) instead. 

    + Query parameters:
      + `code` - Stop code
      + `name` - Stop name  (case insensitive)

    + Examples:

      * [`/stops/stop`](http://transit.kshvmdn.com/api/v1/stops/stop)

        ```js
        {
          "error": {
            "code": 400,
            "message": "Expected at least one parameter."
          }
        }
        ```

      * [`/stops/stop?code=4035`](http://transit.kshvmdn.com/api/v1/stops/stop?code=4035)

        ```js
        {
          "data": [
            {
              "route_id": "1004",
              "route": "1",
              "route_name": "Queen, West",
              "stops": [
                {
                  "stop": "4035",
                  "stop_name": "Highway 50 - Zum Queen Station Stop"
                }
              ]
            },
            {
              "route_id": "1001",
              "route": "1",
              "route_name": "Queen, East",
              "stops": [
                {
                  "stop": "4035",
                  "stop_name": "Highway 50 - Zum Queen Station Stop"
                }
              ]
            },
            ...
          ],
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

  - [`/search/stops/:query`](http://transit.kshvmdn.com/api/v1/search/stops/:query)

    + Retrieve a list of stops matching the provided `query`.

    + Examples:

      * [`/search/stops/bramalea`](http://transit.kshvmdn.com/api/v1/search/stops/bramalea)

        ```js
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
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

  - [`/stop/:stop`](http://transit.kshvmdn.com/api/v1/stop/:stop)

    + Retrieve a list of upcoming busses at the given `stop`.

    + Examples:

      * [`/stop/1113`](http://transit.kshvmdn.com/api/v1/stop/1113)

        ```js
        {
          "data": {
            "stop": "1113",
            "stop_name": "Bramalea - Zum Steeles Station Stop",
            "routes": [
              {
                "route": "511",
                "direction": "Zum Steeles WB",
                "eta": "07:26 PM"
              },
              {
                "route": "11",
                "direction": "Steeles WB-11A",
                "eta": "07:33 PM"
              },
              ...
            ]
          },
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

      * [`/stop/2000`](http://transit.kshvmdn.com/api/v1/stop/2000)

        ```js
        {
          "data": {
            "stop": "2000",
            "stop_name": "Trinity Common Terminal Route 33/23",
            "routes": [
              {
                "route": "23",
                "direction": "Sandalwood EB",
                "eta": "Due"
              },
              {
                "route": "23",
                "direction": "Sandalwood EB",
                "eta": "07:42 PM"
              },
              ...
            ]
          },
          "status": {
            "code": 200,
            "message": "OK"
          }
        }
        ```

### Hosting / running

#### Requirements

  - [Node.js](https://nodejs.org/en/) (v6+)
  - [Redis](http://redis.io/)

#### Installation

  - <a name="clone-repo"/>Clone repository.</a>

    ```sh
    $ git clone https://github.com/kshvmdn/brampton-transit-api.git brampton-transit-api && cd $_
    ```

  - Install npm dependencies.

    ```sh
    $ npm install
    ```

  - Start Redis. Use `--daemonize yes` to run server in background.

    ```sh
    $ redis-server
    ```

  - Start the application server.

    ```sh
    $ PORT=<port> HOST=<host> REDIS_URL=<redis_url> NODE_ENV=<node_env> npm start # use start:dev to watch for changes
    ```

#### Running with [Docker Compose](https://docs.docker.com/compose/)

  - Requirements:
    + [Docker Compose](https://docs.docker.com/compose/install/).

  - [Clone repository](#clone-repo).

    ```sh
    $ cd docker
    ```

  - Build containers.

    ```sh
    $ docker-compose build
    ```

  - Start containers. Add `-d` to run in detached mode (i.e. in the background).

    ```sh
    $ docker-compose up
    ```

## Contribute

  This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) or [submit a PR](https://github.com/kshvmdn/next-ride-api/pulls). Refer to the [self-hosting](#self-hosting) guide to get started. 

  Before submitting a PR, please ensure your changes comply with the [Standard](https://github.com/feross/standard) style guide for JavaScript code.

  ```sh
  $ npm run test:lint
  ```

## License

[MIT](LICENSE) © [Kashav Madan](http://kshvmdn.com).
