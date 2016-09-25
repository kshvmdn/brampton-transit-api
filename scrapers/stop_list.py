from collections import OrderedDict

import requests
from bs4 import BeautifulSoup

from helpers.get_viewstate import get_viewstate


class StopListScraper:
    """
    Scrape a list of stops for each route.
    """

    BASE_URL = 'http://nextride.brampton.ca/RealTime.aspx'

    VIEWSTATE = '__VIEWSTATE'
    VIEWSTATE_GENERATOR = '__VIEWSTATEGENERATOR'

    EVENT_TARGET = '__EVENTTARGET'
    EVENT_ARGUMENT = '__EVENTARGUMENT'

    ROUTE_DROPDOWN = 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownRoute'
    STOP_DROPDOWN = 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownStop'

    def scrape(opts=None, route_id=None):
        return StopListScraper.parse(StopListScraper.get(), opts, route_id)

    def get(route=None):
        if not route:
            return requests.get(StopListScraper.BASE_URL)

        payload = get_viewstate(StopListScraper.BASE_URL,
                                StopListScraper.VIEWSTATE,
                                StopListScraper.VIEWSTATE_GENERATOR)

        if not payload:
            return

        payload.update({
            StopListScraper.ROUTE_DROPDOWN: route,
            StopListScraper.EVENT_TARGET: StopListScraper.ROUTE_DROPDOWN,
            StopListScraper.EVENT_ARGUMENT: ''
        })

        return requests.post(StopListScraper.BASE_URL, data=payload)

    def parse(resp, opts=None, route_id=None):
        if not resp:
            return None

        soup = BeautifulSoup(resp.text, 'html.parser')

        data = []

        route_select = soup.find(id='tab2').find('select')

        if not route_select:
            return

        for route_option in route_select.find_all('option')[1:]:
            route = route_option['value']

            route_number, route_name = route_option.text.strip().split(' - ')

            if route_id and route_number != str(route_id):
                continue

            try:
                stop_soup = BeautifulSoup(StopListScraper.get(route).text,
                                          'html.parser')
                stop_select = stop_soup.find(
                    id=StopListScraper.STOP_DROPDOWN.replace('$', '_'))
            except:
                continue

            doc = OrderedDict([
                ('route', route_number),
                ('route_name', route_name),
                ('stops', [])
            ])

            for stop_option in stop_select.find_all('option')[1:]:
                stop_code, stop_name = stop_option.text.split(', ')

                doc['stops'].append(OrderedDict([
                    ('stop', stop_code),
                    ('stop_name', stop_name)
                ]))

            if opts and opts['sort']:
                doc['stops'] = sorted(doc['stops'], key=lambda k: k['stop'])

            data.append(doc)

        return data


if __name__ == '__main__':
    import sys
    import json

    data = StopListScraper.scrape()
    dump = json.dumps(data)
    print(dump)
