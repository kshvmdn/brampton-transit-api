import requests

from bs4 import BeautifulSoup
from collections import OrderedDict

BASE_URL = 'http://nextride.brampton.ca/mob/RealTime.aspx'


def scrape():
    return parse(get())


def get():
    return requests.get()


def parse(resp):
    if not resp:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')
