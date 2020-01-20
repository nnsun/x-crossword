import json

from flask import Flask
from flask_socketio import SocketIO, join_room, emit, send
from flask_pymongo import PyMongo

app = Flask(__name__, static_folder='static')
app.config["MONGO_URI"] = "mongodb://localhost:27017/xCrosswordDB"
mongo = PyMongo(app)
socketio = SocketIO(app)

import src.views
