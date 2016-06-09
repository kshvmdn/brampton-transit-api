import json
import sys

from scraper import scrape

data = scrape(sys.argv[1])
json = json.dumps(data)

print(json)
