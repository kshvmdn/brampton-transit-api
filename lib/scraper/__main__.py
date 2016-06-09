import json
import sys

from scraper import scrape

stop = sys.argv[1]
data = scrape(stop)
dump = json.dumps(data)

print(dump)
