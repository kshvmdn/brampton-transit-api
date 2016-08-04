# next-ride-api

A scraper and web API for Brampton Transit's [Next Ride](http://nextride.brampton.ca/) service.

## Scraper

- Data source: Next Ride [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx).
- Scraper is located at [`./lib/scraper`](lib/scraper).

## API

### Requirements

- Node.js (`^4.0.0`)
- Python (`^2.7`)

### Getting started

- Clone proj., cd to directory.

    ```sh
    $ git clone https://github.com/kshvmdn/next-ride-api.git && cd next-ride-api
    ```

- Install Python requirements & Node deps.

    ```sh
    $ pip install -r ./lib/scraper/requirements.txt && npm install
    ```

- Run app, listening at [`localhost:8080`](http://localhost:8080) (or your preset environment PORT).

    ```sh
    $ node start
    ```

### Usage

```
/api/stop/:stop
```

Find `stop` through [Next Ride](http://nextride.brampton.ca/RealTime.aspx) (endpoint/scraper in the works).

### Example

```
http://localhost:8080/api/stop/3498
```

_Coming soon_

## Contribute

This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) / [make a PR](https://github.com/kshvmdn/next-ride-api/pulls) with questions/requests/features/fixes.
