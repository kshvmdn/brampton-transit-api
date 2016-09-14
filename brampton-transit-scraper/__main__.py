import json
import os
import sys

from scrapers.stop_scraper import StopScraper
from scrapers.stop_list_scraper import StopListScraper

if __name__ == '__main__':
    import time

    t = time.time()

    if len(sys.argv) <= 1:
        data = StopListScraper.scrape()
        dump = json.dumps(data)
        with open('.data/stops.json', 'w') as f:
            f.write(dump)
    else:
        data = StopScraper.scrape(sys.argv[1])
        dump = json.dumps(data)
        print(dump)

    with open('.data/log.txt', 'a+') as f:
        f.write(u'%s %0.3f\n' % (sys.argv, time.time() - t))
