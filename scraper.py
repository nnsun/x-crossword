import csv
import datetime
import json
import os

import bs4
import requests


def main():
    d = datetime.date(2019, 1, 6)
    day_mapping = {
        'Sunday': [],
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': []
    }
    while d < datetime.date.today():
        day_str = str(d.day)
        if d.day < 10:
            day_str = '0' + str(d.day)
        month = d.month
        date_str = str(d.month) + '/' + day_str + '/' + str(d.year)
        day_of_week = scrape(date_str)
        d += datetime.timedelta(days=1)
        if day_of_week is None:
            continue
        day_mapping[day_of_week].append(date_str)
        
    with open('day_mapping.json', 'w') as f:
        json.dump(day_mapping, f)


def scrape(date):
    try:
        crossword_page = 'https://www.xwordinfo.com/Crossword?date=' + date
        page_request = requests.get(crossword_page)
        page_request.raise_for_status()

        page_bs4 = bs4.BeautifulSoup(page_request.text, 'html.parser')
        
        analysis = page_bs4.find('div', id='analysis').find('p')
        words = analysis.get_text().split(' ')
        for i in range(len(words)):
            if words[i] == 'circles' or words[i] == 'shaded':
                if words[i-1] != '0':
                    return None
            elif words[i] == 'rebus':
                if words[i-1] != '0':
                    return None

        date = date.replace('/', '-')
        os.mkdir('crosswords/' + date)
    except KeyboardInterrupt as e:
        raise e
    except:
        return None
    
    title = page_bs4.find('title')
    day = title.string.split(',', 1)[0].strip()
    with open('crosswords/' + date + '/day.txt', 'w') as f:
        f.write(day)

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
    with open('crosswords/' + date + '/board.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerows(board)

    clues = parse_clues(page_bs4)
    with open('crosswords/' + date + '/clues.json', 'w') as f:
        json.dump(clues, f)
    
    return day

    
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
    main()
