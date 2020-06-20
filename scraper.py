import csv
import datetime
import json
import sys

import bs4
import requests
import pymongo


client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.xCrosswordDB
puzzles = db.puzzles


def main(start, end):
    puzzles.create_index('day')
    puzzles.create_index('date', unique=True)

    start_split = start.split('/')
    start_date = datetime.date(int(start_split[2]), int(start_split[0]), int(start_split[1]))

    end_split = end.split('/')
    end_date = datetime.date(int(end_split[2]), int(end_split[0]), int(end_split[1]))

    while start_date < end_date:
        date_str = "{}/{}/{}".format(start_date.month, start_date.day, start_date.year)
        scrape(date_str)
        start_date += datetime.timedelta(days=1)


def scrape(date):
    try:
        crossword_page = 'https://www.xwordinfo.com/Crossword?date=' + date
        page_request = requests.get(crossword_page)
        page_request.raise_for_status()

        page_bs4 = bs4.BeautifulSoup(page_request.text, 'html.parser')

        analysis = page_bs4.find('div', id='analysis').find('p')
        words = analysis.get_text().split(' ')
        for i in range(len(words)):
            if 'circles' in words[i] or 'shaded' in words[i]:
                if words[i-1] != '0':
                    return
            elif words[i] == 'rebus':
                if words[i-1] != '0':
                    return

        date = date.replace('/', '-')

        title = page_bs4.find('title')
        day = title.string.split(',', 1)[0].strip()

        table_id = 'PuzTable'
        table = page_bs4.find('table', id=table_id)

        board = []
        for row in table.children:
            if type(row) == bs4.element.Tag:
                board_row = []
                for col in row.children:
                    if type(col) == bs4.element.Tag:
                        if 'class' in col.attrs:
                            board_row.append(None)
                        else:
                            l = list(col.children)
                            num = l[0].string
                            if num is None:
                                board_row.append(l[1].string)
                            else:
                                board_row.append((l[1].string, num))
                board.append(board_row)
        
        puzzle = {'day': day, 'date': date, 'board': board, 'clues': parse_clues(page_bs4)}
        puzzles.insert_one(puzzle)
        print(date)
    except Exception as e:
        print(e)
        return
    

def parse_clues(page_bs4):
    clues_classes = page_bs4.find_all('div', class_='numclue')
    clues = []
    for clues_source in clues_classes:
        is_clue = False
        num = None
        dir_clues = {}
        for entry in clues_source.children:
            entry = entry.get_text()
            if is_clue:
                clue = entry.rsplit(' : ', 1)[0]
                dir_clues[num] = clue
            else:
                num = entry
            is_clue = not is_clue
        clues.append(dir_clues)
    clues = {'across' : clues[0], 'down' : clues[1]}
    return clues


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: python3 scraper.py <start date in m/d/yyyy> <end date in m/d/yyyy>')

    try:
        main(sys.argv[1], sys.argv[2])
    except KeyboardInterrupt:
        pass
