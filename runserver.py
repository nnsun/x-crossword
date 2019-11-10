from os import environ
from src import app, socketio


if __name__ == '__main__':
    # socketio.run(app, host='192.168.1.237', port=5000)
    socketio.run(app, debug=True)
