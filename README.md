# next-ride-api

A scraper and web API for Brampton Transit's Next Ride service. Requires self-hosting. 

## Scraper

- Data source: Next Ride [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx).

- Scraper is located in [`./lib/scraper`](lib/scraper).

## API

### Requirements

- Node.js (^4.0.0)
- Python (^2.7)

### Getting started

- Clone/fork proj. & cd to directory
    
    ```sh
    $ git clone https://github.com/kshvmdn/next-ride-api.git && cd next-ride-api
    ```

- Install python requirements & node deps
    
    ```sh
    $ pip install -r ./lib/scraper/requirements.txt && npm install
    ```

- Run, app running at localhost:8080 (or your env PORT)

    ```sh
    $ node start
    ```

### Usage

```
/api/stop/:stop
```

Find `stop` with [Next Ride](http://nextride.brampton.ca/RealTime.aspx).

### Example

```
http://localhost:8080/api/stop/3498
```

```json
{
  "stop": {
    "id": "3498",
    "name": "Torbram Rd s/of Father Tobin Rd"
  },
  "routes": [
    {
      "direction": "Torbram SB",
      "route": "14",
      "time": "7 min(s)"
    },
    {
      "direction": "Torbram SB",
      "route": "14",
      "time": "11:13 PM"
    },
    {
      "direction": "Torbram SB",
      "route": "14",
      "time": "11:43 PM"
    }
  ]
}
```

## Contribute

Feel free to open [issues](https://github.com/kshvmdn/next-ride-api/issues) for requests/questions or submit [PRs](https://github.com/kshvmdn/next-ride-api/pulls) with features/fixes.
