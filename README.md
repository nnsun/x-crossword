# x-crossword

X-Crossword is a crossword app that you can play with friends! Every user's board is synced up to each others' changes. 

![Screenshot](docs/screenshot.png?raw=true "Screenshot")

X-Crossword uses [XWord Info](https://www.xwordinfo.com/) to scrape daily New York Times crossword puzzle data. 

## Architecture

Technologies used include Python, Flask, MongoDB, and WebSockets. 

## Setup

You'll need to have [MongoDB](https://docs.mongodb.com/manual/installation/) and [Pipenv](https://pipenv.pypa.io/en/latest/) installed.

1. Clone this repo: `git clone git@github.com:nnsun/x-crossword.git`, `cd x-crossword`

2. Install required Python packages: `pipenv install`

3. Start the Mongo daemon, usually `sudo service mongod start`

4. Run the scraper: `python3 scraper.py <start date> <end date>`. This populates the database with the crosswords from the given range. 
Any "weird" crosswords with circles or rebus squares are skipped for now. 

5. Run the server locally: `python3 runserver.py <date>`. This serves up the crossword from date argument on `localhost:5000` by default.
 
 All date inputs should be in the format `mm/dd/yyyy`. 
