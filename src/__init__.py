import json

from flask import Flask
from flask_socketio import SocketIO, join_room, emit, send

app = Flask(__name__, static_folder='static')
socketio = SocketIO(app)

with open('day_mapping.json', 'r') as f:
    day_mapping = json.load(f)

import src.views
