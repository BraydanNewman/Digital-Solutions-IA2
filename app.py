from os import path
import requests
import time
from flask import render_template, Flask, request, flash
from flask_login import LoginManager, login_user
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/food_truck.sqlite'
app.config['SECRET_KEY'] = 'secret_key'

api_url = "https://www.bnefoodtrucks.com.au/api/1/trucks"

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

from tables import User, Trucks

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


def api_data_database():
    data = requests.get(api_url)
    final_data = data.json()
    if db.session.query(Trucks).count() > 0:
        db.session.query(Trucks).delete()
        db.session.commit()
    for item in final_data:
        if item["category"] != "":
            me = Trucks(api_key=item["truck_id"], name=item["name"], category=item["category"],
                        picture=item['avatar']['src'])
            db.session.add(me)
    db.session.commit()


def truck_cul():
    for value in db.session.query(Trucks.category).distinct():
        if Trucks.query.filter_by(category=value[0]).count() < 3:
            Trucks.query.filter_by(category=value[0]).delete()
    db.session.commit()
    if db.session.query(Trucks.category).distinct().count() > 5:
        cats = {}
        for value in db.session.query(Trucks.category).distinct():
            num = Trucks.query.filter_by(category=value[0]).count()
            cats[value[0]] = num
        final = min(cats.items(), key=lambda x: x[1])
        Trucks.query.filter_by(category=final[0]).delete()
        db.session.commit()


def selected_truck(selected_id):
    data = requests.get(api_url)
    final_data = data.json()
    for item in final_data:
        if item["truck_id"] == selected_id:
            return item
    return "error"


@app.route('/')
def hello():
    api_data_database()
    truck_cul()
    data = Trucks.query.all()
    return render_template('main.html', data=data)


@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    if User.query.filter_by(username=username).first() is None:
        password = request.form['password']
        user_password_hash = pbkdf2_sha256.hash(password)
        if request.form['own_truck'] == "yes":
            truck_name = request.form['food_truck']
            user = User(username=username, password=user_password_hash, owner_truck_name=truck_name)
        else:
            user = User(username=username, password=user_password_hash)
        db.session.add(user)
        db.session.commit()
        flash('You were successfully signed up')
        return render_template("login.html")
    else:
        flash('That username already exists')
        return render_template("add_user.html")


@app.route('/login', methods=['POST'])
def login():
    selection_type = request.form['type']
    if selection_type == 'add_user':
        return render_template('add_user.html')

    username = request.form['username']
    user = User.query.filter_by(username=username).first()
    if user is not None:
        password = request.form['password']
        if pbkdf2_sha256.verify(password, user.password):
            login_user(user)
            flash("You where successfully logged in")
            return render_template('base.html')
    flash("Username or Password was incorrect")
    return render_template("login.html")


@app.route('/option_trucks/<string:option>', methods=['POST', 'GET'])
def option_truck(option):
    data = selected_truck(option)
    return render_template('truck.html', data=data)


if __name__ == "__main__":
    app.run(debug=True)
