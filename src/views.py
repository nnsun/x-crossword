import csv
import json
import sqlite3

from flask import render_template, request, session, redirect, url_for, flash
import pymongo
import requests

from src import *
from src.models.square.square import initial


puzzles = mongo.db.puzzles
squares = mongo.db.squares
date = '3-10-2020'
room = 'default'

@app.route('/')
def index():
    puzzle = puzzles.find_one({'date': date})

    board = []
    insert = squares.count_documents({'date': date}) == 0

    for i in range(len(puzzle['board'])):
        board_row = []
        for j in range(len(puzzle['board'][i])):
            entry = puzzle['board'][i][j]
            if entry and type(entry) != str:
                square = initial(date, i, j, entry[0], int(entry[1]))
            else:
                square = initial(date, i, j, entry)
            board_row.append(square)
            if insert:
                squares.insert_one(square)
        board.append(board_row)

    return render_template('index.html', clues=puzzle['clues'])

@socketio.on('create')
def on_create():
    board_squares = squares.find({'date': date}, projection={'_id': False}, sort=[('row', pymongo.ASCENDING), ('col', pymongo.ASCENDING)])
    board = []
    row = []
    for square in board_squares:
        if square['col'] == 0 and row:
            board.append(row)
            row = []
        row.append(square)
    board.append(row)

    join_room(room)
    emit('board', json.dumps(board))


@socketio.on('update')
def on_keypress(data):
    row = int(data['row'])
    col = int(data['col'])
    ts = float(data['ts'])
    square = squares.find_one({'date': date, 'row': row, 'col': col})

    if ts > square['timestamp']:
        emit('update', json.dumps(data), room=room)
        squares.update_one({'date': date, 'row': row, 'col': col}, {"$set": {'letter': data['letter'], 'timestamp': ts}})


@socketio.on('check')
def on_check(data):
    correct = []
    for entry in data:
        row = int(entry['row'])
        col = int(entry['col'])
        square = squares.find_one({'date': date, 'row': row, 'col': col})
        if square['answer'] == entry['letter'].upper():
            correct.append({'row': row, 'col': col})
            squares.update_one({'date': date, 'row': row, 'col': col}, {"$set": {'checked': True}})
    emit('check', json.dumps(correct), room=room)
