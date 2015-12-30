# NextRide Brampton Transit API
A full-featured web API for Brampton Transit services. As it stands, it requires self-hosting. See below for instructions on usage. 

## Usage

```
/api?code={stop_code}
```

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
