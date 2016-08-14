import json
import os
import sys

from scrape_single_stop import scrape as get_stop
from scrape_stop_list import scrape as get_stop_list


def main():
    if len(sys.argv) <= 1:
        data = get_stop_list()
        with open('data/stops.json', 'w') as f:
            f.write(json.dumps(data))
    else:
        data = get_stop(sys.argv[1])
        dump = json.dumps(data)
        print(dump)

if __name__ == '__main__':
    main()
