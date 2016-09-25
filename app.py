#!/usr/bin/env python3
import logging
import os
import time
from logging.handlers import RotatingFileHandler

from flask import abort, Flask, jsonify, request

from scrapers.stop_scraper import StopScraper
from scrapers.stop_list_scraper import StopListScraper

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


@app.before_request
def log_before_request():
    app.logger.start = time.time()
    return None


@app.after_request
def log_after_request(response):
    response_time = time.time() - app.logger.start if app.logger.start else 0

    params = {
        'method': request.method,
        'in': int(response_time * 1000),
        'url': request.path,
        'ip': request.remote_addr,
        'qs': str(request.query_string, 'utf-8')
    }

    app.logger.info('%(ip)s - %(method)s %(url)s?%(qs)s (%(in)sms)', params)

    return response


@app.route('/api/routes')
def all_routes():
    response = list(map(lambda k: {
        'route_name': k['route_name'],
        'route': k['route']}, StopListScraper.scrape()))

    if not response:
        return abort(400, 'Failed to scrape route list.')

    return jsonify(data=response, meta=dict(status=200, message='OK'))


@app.route('/api/stops')
def all_stop_lists():
    response = StopListScraper.scrape({
        'sort': request.args.get('sort', default='0') == 1})

    if not response:
        return abort(400, 'Failed to scrape stop list.')

    return jsonify(data=response, meta=dict(status=200, message='OK'))


@app.route('/api/stops/<int:route_id>')
def single_stop_list(route_id):
    response = StopListScraper.scrape({
        'sort': request.args.get('sort', default='0') == '1'}, route_id)

    if not response:
        return abort(400, 'Failed to scrape stop list for route.')

    return jsonify(data=response, meta=dict(status=200, message='OK'))


@app.route('/api/stop/<stop_id>')
def single_stop(stop_id):
    print(request.args.get('c', default='0') == '1')
    response = StopScraper.scrape(stop_id, {
        'compact': request.args.get('c', default='0') == '1'})

    if not response:
        return abort(400, 'Failed to scrape data for stop `%s`.' % stop_id)

    return jsonify(data=response, meta=dict(status=200, message='OK'))


@app.errorhandler(400)
@app.errorhandler(403)
@app.errorhandler(404)
def bad_request(error):
    response = jsonify(meta=dict(status=error.code, message=error.description))
    return response, error.code

if __name__ == '__main__':
    HOST, PORT, DEBUG, LOGFILE = (os.environ.get('HOST', '0.0.0.0'),
                                  os.environ.get('PORT', 3000),
                                  os.environ.get('DEBUG', False),
                                  os.environ.get('LOGFILE', 'app.log'))

    formatter = logging.Formatter(
        '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s')
    handler = RotatingFileHandler(LOGFILE, maxBytes=10000000, backupCount=5)
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)

    app.logger.addHandler(handler)
    app.run(host=HOST, port=int(PORT), debug=DEBUG)
