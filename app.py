import random
import string

from flask import render_template, Flask, sessions, request, redirect, url_for
import requests, json, sqlite3
from flask_login import LoginManager, UserMixin, login_required, login_user

from SQL_strings import *
from passlib.hash import sha256_crypt


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
login_manager = LoginManager(app)
login_manager.login_view = "login"


class User(UserMixin):
    Name = ""
    AlternateID = ""

    def get_id(self):
        return self.AlternateID

@login_manager.user_loader
def load_user(user_id):
    db = sqlite3.connect('database/food_truck.sqlite')
    cursor = db.cursor()
    cursor.execute(get_user_login_sql_id, (user_id,))
    result = cursor.fetchall()
    u = User()
    u.Name = result[0]
    u.AlternateID = result[1]
    return u


def api_data_clean():
    url = "https://www.bnefoodtrucks.com.au/api/1/trucks"
    data = requests.get(url)
    sessions['trucks'] = data.json()


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def valid_login(username, password):
    success = False
    try:
        db = sqlite3.connect('database/food_truck.sqlite')
        cursor = db.cursor()
        cursor.execute(get_user_login_sql, (username, ))
        result = cursor.fetchall()

        if sha256_crypt.verify(password, result):
            print("P")
            success = True
            u = User()
            u.Name = username
            u.AlternateID = id_generator().encode('UTF-8', 'strict')
            login_user(u)


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


@app.route('/sign_up', methods=['POST', 'GET'])
def sign_up():
    return


if __name__ == "__main__":
    app.run(debug=True)
