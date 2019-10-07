import json

from flask import Flask

app = Flask(__name__, static_folder="static")

db = "database.db"

with open("day_mapping.json", 'r') as f:
    day_mapping = json.load(f)

import src.views
