from collections import OrderedDict

import requests
from bs4 import BeautifulSoup

from helpers.get_viewstate import get_viewstate


class StopSearchScraper:
    """
    Scrape the list of stops after performing a keyword search.
    """

    BASE_URL = 'http://nextride.brampton.ca/mob/SearchBy.aspx'

    VIEWSTATE = '__VIEWSTATE'
    VIEWSTATEGENERATOR = '__VIEWSTATEGENERATOR'
    STOP_INPUT = 'ctl00$mainPanel$searchbyStop$txtStop'
    FORM_SUBMIT = 'ctl00$mainPanel$btnGetRealtimeSchedule'

    DESCRIPTION = 'ctl00_mainPanel_lblStopDescription'
    RESULTS = 'ctl00_mainPanel_gvSearchResult'
    ERROR = 'ctl00_mainPanel_lblError'
    STOP_SELECT = 'ctl00_mainPanel_searchbyStop_ddlStopList'

    def scrape(query):
        return StopSearchScraper.parse(StopSearchScraper.get(query))

    def get(query):
        payload = get_viewstate(StopSearchScraper.BASE_URL,
                                StopSearchScraper.VIEWSTATE,
                                StopSearchScraper.VIEWSTATEGENERATOR)

        if not payload:
            return None

        payload.update({
            StopSearchScraper.STOP_INPUT: query,
            StopSearchScraper.FORM_SUBMIT: True
        })

        return requests.post(StopSearchScraper.BASE_URL, data=payload)

    def parse(resp):
        if not resp:
            return None

        soup = BeautifulSoup(resp.text, 'html.parser')

        results = soup.find(id=StopSearchScraper.STOP_SELECT)

        if not results:
            return None

        data = []

        for option in results.find_all('option')[1:]:
            stop = option['value']
            stop_name = option.text.split(', ')[1].strip()

            if not (stop and stop_name):
                continue

            data.append(OrderedDict([
                ('stop', stop),
                ('stop_name', stop_name)
            ]))

        return data

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
    data = StopSearchScraper.scrape(stop)
    dump = json.dumps(data)
    print(dump)
