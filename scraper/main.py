import json
import sys

from functions import scrape

schedule = scrape(1600)
print(json.dumps(schedule, indent=2))
