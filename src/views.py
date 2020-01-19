import csv
import json
import sqlite3

from flask import render_template, request, session, redirect, url_for, flash
import requests

from src import *
from src.models.square.square import Square


date = '1-07-2020'
board = None
room = 'default'

@app.route('/')
def index():
    global board

    puzzle = puzzles.find_one({'date': date})

    board = []
    for row in puzzle['board']:
        board_row = []
        for entry in row:
            print(entry)
            if entry and type(entry) != str:
                square = Square(entry[0], int(entry[1]))
            else:
                square = Square(entry)
            board_row.append(square)
        board.append(board_row)

    return render_template('index.html', clues=puzzle['clues'])


@socketio.on('create')
def on_create():
    if board is not None:
        board_json = []
        for row in board:
            row_json = []
            for square in row:
                row_json.append(square.initial())
            board_json.append(row_json)

        join_room(room)
        emit('board', json.dumps(board_json))


@socketio.on('update')
def on_keypress(data):
    row = int(data['row'])
    col = int(data['col'])
    ts = float(data['ts'])
    if ts > board[row][col].timestamp:
        emit('update', json.dumps(data), room=room)
        board[row][col].timestamp = ts


@socketio.on('check')
def on_check(data):
    correct = []
    for entry in data:
        if board[int(entry['row'])][int(entry['col'])].answer == entry['letter'].upper():
            correct.append({'row': entry['row'], 'col': entry['col']})
    emit('check', json.dumps(correct), room=room)
