import requests

from bs4 import BeautifulSoup


def get_viewstate(url, *args):
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'html.parser')

    if not soup:
        return None

    payload = {}

    for key in args:
        element = soup.find(id=key)

        if not element:
            return None

        payload[key] = element['value']

    return payload
