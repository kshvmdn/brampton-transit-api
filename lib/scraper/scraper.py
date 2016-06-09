import requests

from bs4 import BeautifulSoup
from collections import OrderedDict
from constants import *


def scrape(stop):
    return parse(get(stop))


def get(stop):
    payload = get_viewstate()

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

    if not description:
        return None

    stop_number, stop_name = [x.strip() for x in description.text.split(', ')]

    data['stop'].update([
        ('id', stop_number.replace('Stop', '').strip()),
        ('name', stop_name)
    ])

    results = soup.find(id=RESULTS)

    if not results:
        return None

    for tr in results.find_all('tr')[1:]:
        td = tr.find_all('td')

        route, direction = [x.strip() for x in td[0].text.split(' to ')]
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


def get_viewstate():
    resp = requests.get(BASE_URL)
    soup = BeautifulSoup(resp.text, 'html.parser')

    payload = {}

    for key in VIEWSTATE, VIEWSTATEGENERATOR:
        element = soup.find(id=key)

        if not element:
            return None

        payload[key] = element['value']

    return payload


if __name__ == '__main__':
    import sys
    import json

    stop = sys.argv[1]
    data = scrape(stop)
    dump = json.dumps(data)
    print(dump)
