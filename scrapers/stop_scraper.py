import requests

from bs4 import BeautifulSoup
from collections import OrderedDict

from helpers.get_viewstate import get_viewstate


class StopScraper:
    """
    Scrape the schedule for a single stop.
    """

    BASE_URL = 'http://nextride.brampton.ca/mob/SearchBy.aspx'

    VIEWSTATE = '__VIEWSTATE'
    VIEWSTATEGENERATOR = '__VIEWSTATEGENERATOR'
    STOP_INPUT = 'ctl00$mainPanel$searchbyStop$txtStop'
    FORM_SUBMIT = 'ctl00$mainPanel$btnGetRealtimeSchedule'

    DESCRIPTION = 'ctl00_mainPanel_lblStopDescription'
    RESULTS = 'ctl00_mainPanel_gvSearchResult'
    ERROR = 'ctl00_mainPanel_lblError'

    def scrape(stop, opts):
        return StopScraper.parse(StopScraper.get(stop), opts)

    def get(stop):
        payload = get_viewstate(StopScraper.BASE_URL, StopScraper.VIEWSTATE,
                                StopScraper.VIEWSTATEGENERATOR)

        if not payload:
            return None

        payload.update({
            StopScraper.STOP_INPUT: stop,
            StopScraper.FORM_SUBMIT: True
        })

        return requests.post(StopScraper.BASE_URL, data=payload)

    def parse(resp, opts):
        if not resp:
            return None

        soup = BeautifulSoup(resp.text, 'html.parser')

        description = soup.find(id=StopScraper.DESCRIPTION)
        results = soup.find(id=StopScraper.RESULTS)
        error = soup.find(id=StopScraper.ERROR)

        if error or not (description and results):
            return None

        stop_number, stop_name = \
            [x.strip() for x in description.text.split(', ')]

        data = OrderedDict([
            ('stop', stop_number.replace('Stop', '').strip()),
            ('stop_name', stop_name),
            ('routes', [])
        ])

        for tr in results.find_all('tr')[1:]:
            td = tr.find_all('td')

            if any('no service' in c.text.lower() for c in td):
                # No service, return dataset with empty routes list
                return data

            route, direction = [c.strip() for c in td[0].text.split(' to ', 1)]
            route = route.replace('Route', '').strip()

            time = td[1].text.strip()

            match = None if not opts['compact'] else \
                next((r for r in data['routes']
                      if r['direction'] == direction and r['route'] == route),
                     None)

            if not match:
                data['routes'].append(OrderedDict([
                    ('route', route),
                    ('direction', direction),
                    ('times', [time])
                ]))
            else:
                match['times'].append(time)

        return data


if __name__ == '__main__':
    import sys
    import json

    stop = sys.argv[1]
    data = StopScraper.scrape(stop)
    dump = json.dumps(data)
    print(dump)
