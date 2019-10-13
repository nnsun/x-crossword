from os import environ
from src import app, socketio


if __name__ == '__main__':
    socketio.run(app, debug=True)
