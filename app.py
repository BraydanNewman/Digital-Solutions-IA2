from os import path
import requests
import time
from flask import render_template, Flask, sessions, request
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/food_truck.sqlite'
app.config['SECRET_KEY'] = 'secret_key'

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

from tables import User
if path.exists('database/food_truck.sqlite'):
    db.create_all()
    while not path.exists('database/food_truck.sqlite'):
        time.sleep(3)

if User.query.filter_by(username='admin').first() is None:
    password_hash = pbkdf2_sha256.hash("admin")
    admin = User(username='admin', password=password_hash, rank="admin")
    db.session.add(admin)
    db.session.commit()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def api_data_clean():
    url = "http://www.bnefoodtrucks.com.au/api/1/trucks"
    data = requests.get(url)
    sessions['trucks'] = data.json()


@app.route('/')
def hello():
    return render_template('login.html')


@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    if User.query.filter_by(username='missing').first() is None:
        pass

    password = request.form['password']

    if request.form['own_truck'] == "yes":
        truck_name = request.form['food_truck']

    user = User.query.filter_by(username=username).first()



    user = User.query.filter_by(username=username).first()

    print(user)

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return render_template("base.html")


@app.route('/login', methods=['POST'])
def login():
    selection_type = request.form['type']
    if selection_type == 'add_user':
        return render_template('add_user.html')

    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()

    return render_template('base.html')


@app.route('/main')
def main():
    return 'Hello, World!'


@app.route('/sign_up', methods=['POST', 'GET'])
def sign_up():
    return


if __name__ == "__main__":
    app.run(debug=True)
