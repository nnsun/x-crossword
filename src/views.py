from ast import literal_eval
import csv
import json
import sqlite3

from flask import render_template, request, session, redirect, url_for, flash
import requests

from src import *
from src.models.square.square import Square


date = '9-07-2019'
puzzle = None
room = 'default'

@app.route('/')
def index():
    global puzzle
    with open('crosswords/' + date + '/board.csv', 'r') as f:
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

    with open('crosswords/' + date + '/clues.json', 'r') as f:
        clues = json.load(f)

    return render_template('index.html', board=puzzle, clues=clues)


@socketio.on('create')
def on_create():
    global puzzle
    if puzzle is not None:
        puzzle_json = []
        for row in puzzle:
            row_json = []
            for square in row:
                row_json.append(square.initial())
            puzzle_json.append(row_json)
        
        join_room(room)
        emit('board', json.dumps(puzzle_json))


@socketio.on('update')
def on_keypress(data):
    emit('update', json.dumps(data), room=room)


@socketio.on('check')
def on_check(data):
    correct = []
    for entry in data:
        if puzzle[int(entry['row'])][int(entry['col'])].answer == entry['letter']:
            correct.append({'row': entry['row'], 'col': entry['col']})
    print(correct)
    emit('check', json.dumps(correct), room=room)