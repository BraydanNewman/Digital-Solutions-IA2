from flask import render_template, Flask, sessions, request, redirect, url_for
import requests, json, sqlite3
from SQL_strings import *
from passlib.hash import pbkdf2_sha256


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


def api_data_clean():
    url = "https://www.bnefoodtrucks.com.au/api/1/trucks"
    data = requests.get(url)
    sessions['trucks'] = data.json()


def valid_login(username, password):
    success = False
    try:
        db = sqlite3.connect('database/food_truck.sqlite')
        cursor = db.cursor()
        cursor.execute(get_user_login_sql, (username, ))
        result = cursor.fetchall()

        if pbkdf2_sha256.verify(password, result):
            success = True
            sessions['username'] = username

    except Exception as error_msg:
        print(error_msg)
    finally:
        db.close()
    return success


@app.route('/')
def hello():
    return render_template('login.html')


@app.route('/add_user')
def add_user():
    username = request.form['username']
    ps_hash = pbkdf2_sha256.hash(request.form['password'])
    try:
        db = sqlite3.connect('database/food_truck.sqlite')
        cursor = db.cursor()
        cursor.execute(add_user_sql, (username, ps_hash))
    except Exception as error_msg:
        print(error_msg)
    finally:
        db.close()

    return 'Hello, World!'


@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'],
                       request.form['password']):
            return redirect(url_for(main))
        else:
            error = 'Invalid username/password'
    return render_template('login.html', error=error)


@app.route('/main')
def main():
    return 'Hello, World!'


if __name__ == "__main__":
    app.run(debug=True)
