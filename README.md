# x-crossword

X-Crossword is a crossword that you can fill out with friends! Features include choosing any New York Times puzzle from any date, simultaneous editing, and answer checking.

## Architecture

Technologies used include Python, Flask, MongoDB, and WebSockets. 

## Setup

1. Clone this repo: `git clone git@github.com:nnsun/x-crossword.git`, `cd x-crossword`
2. Install required Python packages: `pipenv install`
3. Start the Mongo daemon, usually `sudo service mongod start`
4. Run the scraper: `python3 scraper.py`
5. Run the server locally: `python3 runserver.py`
