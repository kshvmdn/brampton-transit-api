import json
import sys

from functions import scrape

schedule = scrape(sys.argv[1])
print(json.dumps(schedule, indent=2))
