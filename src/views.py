from ast import literal_eval
import csv
import json
import sqlite3

from flask import render_template, request, session, redirect, url_for, flash
import requests

from src import *
from src.models.square.square import Square


date = "9-07-2019"

@app.route('/')
def index():
    with open("crosswords/" + date + "/board.csv", 'r') as f:
        sol_list = list(csv.reader(f))

    puzzle = []
    for row in sol_list:
        puzzle_row = []
        for entry in row:
            if entry and entry[0] == '(':
                entry = literal_eval(entry)
                square = Square(entry[0], int(entry[1]))
            else:
                square = Square(entry)
            puzzle_row.append(square)
        puzzle.append(puzzle_row)

    with open("crosswords/" + date + "/clues.json", 'r') as f:
        clues = json.load(f)

    return render_template('board.html', board=puzzle, clues=clues)
