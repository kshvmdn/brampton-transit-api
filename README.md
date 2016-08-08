## next-ride-api

A scraper and web API for Brampton Transit's [Next Ride](http://nextride.brampton.ca/) service.

### Scraper

- Data source: Next Ride [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx).
- Located at [`lib/scraper`](lib/scraper).

### Usage

#### Requirements

- [Node.js](https://nodejs.org/en/) (`6.x.x`)
- [Python](https://www.python.org/download/releases/3.0/) (`3.x`)
- [RethinkDB](https://www.rethinkdb.com/)

#### Getting started

- Clone/[download](https://github.com/kshvmdn/next-ride-api/archive/master.zip) the repository.

  ```sh
  $ git clone https://github.com/kshvmdn/next-ride-api.git
  ```
  
- Install Python requirements + Node dependencies.

  ```sh
  $ pip install -r ./lib/scraper/requirements.txt && npm install
  ```

- Start RethinkDB (I recommend adding the `--daemon` flag, so it runs as a background process, but you can have it running in a different window/tab if you prefer).

  ```sh
  $ rethinkdb [--daemon]
  ```

- Start the Node application. It'll be running at [`http://localhost:3001`](http://localhost:3001) (or your environment-defined `PORT` / `ADDRESS`).

  ```sh
  $ npm run build-scss && npm start
  ```

#### API

- `/stops`

  + Retrieve a list of all stops, separated by route.
  + Data is scraped periodically via [`scrape_stop_list.py`](lib/scraper/scrapers/scrape_stop_list.py).
  + Uses [`node-cron`](https://www.npmjs.com/package/node-cron) to schedule a rescrape once a month (also scrapes once when the API is started).
  + Sample output:
    
    ```js
    // Coming soon...
    ```

- `/stop/:stop`

  + Retrieve the schedule for the given `stop` value (refer to `/stops` for the list of possible values).
  + Data is scraped in real-time via [`scrape_single_stop.py`](lib/scraper/scrapers/scrape_single_stop.py).
  + Sample output:
    
    ```js
    // Coming soon...
    ```

### Contribute

This project is completely open source, feel free to [open an issue](https://github.com/kshvmdn/next-ride-api/issues) / [make a PR](https://github.com/kshvmdn/next-ride-api/pulls) with questions/requests/features/fixes.
