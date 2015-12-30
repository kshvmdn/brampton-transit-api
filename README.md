# NextRide Brampton Transit API
A full-featured web API for Brampton Transit's NextRide service. Self host to use (see instructions below). Scrapes the NextRide [mobile site](http://nextride.brampton.ca/mob/SearchBy.aspx) for all schedules and bus information.

## Usage

```
/api?code={stop_code}
```

Find `stop_code` at [NextRide](http://nextride.brampton.ca/RealTime.aspx) (find by route) and transit stops.

## Requirements
- Node.js + npm
- Python 3

## Running

Clone/fork proj. & cd to directory
```
git clone https://github.com/kshvmdn/NextRideAPI.git && cd NextRideAPI
```

Install python requirements + node dependencies
```
pip3 install -r scraper/requirements.txt && npm install
```

Run project
```
node start
```
