from ast import literal_eval
import csv
import json
import sqlite3

from flask import render_template, request, session, redirect, url_for, flash
import requests

from src import *
from src.models.square.square import Square
from src.models.board.board import Board


@app.route('/')
def index():
    with open("crosswords/9-07-2019/board.csv", 'r') as f:
        sol_list = list(csv.reader(f))

    puzzle = []
    for row in sol_list:
        puzzle_row = []
        for entry in row:
            if entry and entry[0] == '(':
                entry = literal_eval(entry)
                # ('J', '15')

                square = Square(entry[0], int(entry[1]))
            else:
                square = Square(entry)
            puzzle_row.append(square)
        puzzle.append(puzzle_row)

    return render_template('board.html', board=puzzle)
