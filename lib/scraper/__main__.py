import json
import os
import sys

from scrapers.stop_scraper import StopScraper
from scrapers.stop_list_scraper import StopListScraper


def main():
    if len(sys.argv) <= 1:
        data = StopListScraper.scrape()
        with open('data/stops.json', 'w') as f:
            f.write(json.dumps(data))
    else:
        data = StopScraper.scrape(sys.argv[1])
        dump = json.dumps(data)
        print(dump)

if __name__ == '__main__':
    main()
