import json
import time


def initial(date, row, col, answer, num=''):
    d = {}
    d['date'] = date
    d['row'] = row
    d['col'] = col
    d['is_black'] = not bool(answer)
    d['num'] = num
    d['answer'] = answer
    d['checked'] = False
    d['letter'] = None
    d['timestamp'] = 0
    return d
