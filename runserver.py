import sys

from src.app import app, socketio, init_date


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Usage: `python3 runserver.py <date in mm/dd/yyyy>`')
    
    app.config['DATE'] = sys.argv[1]
    init_date()

    if app.config['DEBUG']:
        socketio.run(app, debug=True)
    else:
        socketio.run(app, host=app.config['HOST'], port=5000)

