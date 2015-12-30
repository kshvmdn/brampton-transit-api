import bs4
import requests

URL = 'http://nextride.brampton.ca/mob/SearchBy.aspx'

VIEWSTATE_NAME = '__VIEWSTATE'
with open('viewstate_value.txt', 'r') as f:
    VIEWSTATE_VALUE = f.read()

STOP_NAME = 'ctl00$mainPanel$searchbyStop$txtStop'

SUBMIT_NAME = 'ctl00$mainPanel$btnGetRealtimeSchedule'
SUBMIT_VALUE = True


def scrape(stop):
    return parse(crawl(stop))


def crawl(stop):
    payload = {
        VIEWSTATE_NAME: VIEWSTATE_VALUE,
        STOP_NAME: stop,
        SUBMIT_NAME: SUBMIT_VALUE
    }

    r = requests.post(URL, data=payload)
    return r


def parse(res):
    schedule = {}
    soup = bs4.BeautifulSoup(res.text, 'html.parser')

    error_id = 'ctl00_mainPanel_lblError'
    description_id = 'ctl00_mainPanel_lblStopDescription'
    table_id = 'ctl00_mainPanel_gvSearchResult'

    if soup.find(id=error_id):
        return None

    if soup.find(id=description_id):
        stop_info = soup.find(id=description_id).string
        stop_info = stop_info.split(', ')
        schedule['description'] = {
            'stop_id': int(stop_info[0][5:]),
            'stop_name': stop_info[1]
        }

    if soup.find(id=table_id):
        results = soup.find(id=table_id).find_all('tr')
        if results[1].td.string == 'No Service':
            schedule['status'] = 'Not in service.'
        else:
            schedule['status'] = 'Running.'
            routes = []
            for route in results[1:]:
                route = route.find_all('td')
                route_info = route[0].string.strip().split(' to ', 1)
                routes.append({
                    'time': route[1].string.strip(),
                    'route_no': int(route_info[0][6:]),
                    'direction': route_info[1]
                })
            schedule['routes'] = routes
    return schedule
