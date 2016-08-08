import json
import os
import rethinkdb as r
import sys

from scrapers.scrape_single_stop import scrape as get_stop
from scrapers.scrape_stop_list import scrape as get_stop_list

RDB_HOST = os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
RDB_DB = os.environ.get('RDB_DB') or 'nextride'


def init_db(connection):
    try:
        r.db_create(RDB_DB).run(connection)
        r.db(RDB_DB).table_create('stops').run(connection)
    except:
        return


def main():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)

    init_db(connection)

    if len(sys.argv) <= 1:
        data = get_stop_list()

        r.db(RDB_DB).table('stops').delete().run(connection)

        for route in data:
            r.db(RDB_DB).table('stops').insert(route).run(connection)
    else:
        data = get_stop(sys.argv[1])
        dump = json.dumps(data)
        print(dump)

    connection.close()


if __name__ == '__main__':
    main()
