import requests

from bs4 import BeautifulSoup
from collections import OrderedDict
from pprint import pprint

BASE_URL = 'http://nextride.brampton.ca/RealTime.aspx'

VIEWSTATE = '__VIEWSTATE'
VIEWSTATE_GENERATOR = '__VIEWSTATEGENERATOR'
EVENT_TARGET = '__EVENTTARGET'
EVENT_ARGUMENT = '__EVENTARGUMENT'

ROUTE_DROPDOWN_INPUT = 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownRoute'
ROUTE_DROPDOWN_ID = 'ctl00_mainPanel_MainPanel1_SearchStop1_DropDownRoute'
STOP_DROPDOWN_INPUT = 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownStop'
STOP_DROPDOWN_ID = 'ctl00_mainPanel_MainPanel1_SearchStop1_DropDownStop'


def scrape():
    return parse(get())


def get(route=None):
    if not route:
        return requests.get(BASE_URL)

    payload = {
        ROUTE_DROPDOWN_INPUT: route,
        EVENT_TARGET: ROUTE_DROPDOWN_INPUT,
        EVENT_ARGUMENT: ''
    }
    payload.update(get_viewstate())

    return requests.post(BASE_URL, data=payload)


def parse(resp):
    if not resp:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    data = []

    route_select = soup.find(id='tab2').find('select')

    if not route_select:
        return

    for route_option in route_select.find_all('option')[1:]:
        route = route_option['value']

        if not route:
            continue

        try:
            stop_soup = BeautifulSoup(get(route).text, 'html.parser')
            stop_select = stop_soup.find(id=STOP_DROPDOWN_ID)
        except:
            continue

        route_number, route_name = route_option.text.strip().split(' - ')

        doc = OrderedDict([
            ('route', OrderedDict([
                ('number', route_number),
                ('name', route_name)
            ])),
            ('stops', [])
        ])

        for stop_option in stop_select.find_all('option')[1:]:
            stop_code, stop_name = stop_option.text.split(', ')

            doc['stops'].append(OrderedDict([
                ('stop', stop_code),
                ('name', stop_name)
            ]))

        data.append(doc)

    return data


def get_viewstate():
    resp = requests.get(BASE_URL)
    soup = BeautifulSoup(resp.text, 'html.parser')

    payload = {}

    for key in VIEWSTATE, VIEWSTATE_GENERATOR:
        element = soup.find(id=key)

        if not element:
            return None

        payload[key] = element['value']

    return payload
