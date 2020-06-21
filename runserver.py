import sys

from src import app, socketio


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Usage: `python3 runserver.py <date>`')
    
    app.config['DATE'] = sys.argv[1]

    if app.config['DEBUG']:
        socketio.run(app, debug=True)
    else:
        socketio.run(app, host=app.config['HOST'], port=5000)

