import json
import sys

from scrapers.stop_scraper import scrape as scrape_stop
from scrapers.list_scraper import scrape as scrape_list

data = scrape_list() if len(sys.argv) <= 1 else scrape_stop(sys.argv[1])
dump = json.dumps(data)
print(dump)
