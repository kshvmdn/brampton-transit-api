"""
Scrape the schedule for a single stop.
"""

import requests

from bs4 import BeautifulSoup
from collections import OrderedDict

from utils.viewstate import get_viewstate

BASE_URL = 'http://nextride.brampton.ca/mob/SearchBy.aspx'

VIEWSTATE = '__VIEWSTATE'
VIEWSTATEGENERATOR = '__VIEWSTATEGENERATOR'
STOP_INPUT = 'ctl00$mainPanel$searchbyStop$txtStop'
FORM_SUBMIT = 'ctl00$mainPanel$btnGetRealtimeSchedule'

DESCRIPTION = 'ctl00_mainPanel_lblStopDescription'
RESULTS = 'ctl00_mainPanel_gvSearchResult'
ERROR = 'ctl00_mainPanel_lblError'


def scrape(stop):
    return parse(get(stop))


def get(stop):
    payload = get_viewstate(BASE_URL, VIEWSTATE, VIEWSTATEGENERATOR)

    if not payload:
        return None

    payload.update({
        STOP_INPUT: stop,
        FORM_SUBMIT: True
    })

    return requests.post(BASE_URL, data=payload)


def parse(resp):
    if not resp:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    data = OrderedDict([
        ('stop', OrderedDict()),
        ('routes', [])
    ])

    description = soup.find(id=DESCRIPTION)
    results = soup.find(id=RESULTS)
    error = soup.find(id=ERROR)

    if error or not (description and results):
        return None

    stop_number, stop_name = [x.strip() for x in description.text.split(', ')]

    data['stop'].update([
        ('id', stop_number.replace('Stop', '').strip()),
        ('name', stop_name)
    ])

    for tr in results.find_all('tr')[1:]:
        td = tr.find_all('td')

        if any('no service' in c.text.lower() for c in td):
            # No service, return dataset with empty routes list
            return data

        route, direction = [c.strip() for c in td[0].text.split(' to ')]
        route = route.replace('Route', '').strip()

        time = td[1].text.strip()

        match = next((r for r in data['routes']
                      if r['direction'] == direction and r['route'] == route),
                     None)

        if not match:
            data['routes'].append(OrderedDict([
                ('direction', direction),
                ('route', route),
                ('times', [time])
            ]))
        else:
            match['times'].append(time)

    return data


if __name__ == '__main__':
    import sys
    import json

    stop = sys.argv[1]
    data = scrape(stop)
    dump = json.dumps(data)
    print(dump)
