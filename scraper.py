import csv
import datetime
import json

import bs4
import requests
import pymongo


client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.xCrosswordDB
puzzles = db.puzzles


def main():
    puzzles.create_index('day')
    puzzles.create_index('date', unique=True)

    d = datetime.date(2020, 1, 1)
    while d < datetime.date.today():
        day_str = str(d.day)
        if d.day < 10:
            day_str = '0' + str(d.day)
        month = d.month
        date_str = str(d.month) + '/' + day_str + '/' + str(d.year)
        scrape(date_str)
        d += datetime.timedelta(days=1)


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
    try:
        main()
    except KeyboardInterrupt:
        pass
