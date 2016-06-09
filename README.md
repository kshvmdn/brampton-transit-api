# next-ride-api

A scraper and web API for Brampton Transit's Next Ride service. Requires self-hosting. 

## Scraper

- Data source: Next Ride [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx).

- Scraper is located in [`./lib/scraper`](lib/scraper).

## API

### Usage

```
/api/:stop
```

Find `stop` with [Next Ride](http://nextride.brampton.ca/RealTime.aspx).

### Requirements
- Node.js (^4.0.0)
- Python (^2.7)

### Running

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

## Contribute

Feel free to open [issues](https://github.com/kshvmdn/next-ride-api/issues) for requests/questions or submit [PRs](https://github.com/kshvmdn/next-ride-api/pulls) with features/fixes.
