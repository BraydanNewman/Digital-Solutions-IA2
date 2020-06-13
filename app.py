from os import path
import requests
import time
from flask import render_template, Flask, request, flash, redirect, url_for
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256

app = Flask(__name__)

app.config[ 'SQLALCHEMY_DATABASE_URI' ] = 'sqlite:///database/food_truck.sqlite'
app.config[ 'SECRET_KEY' ] = 'secret_key'

api_url = "http://www.bnefoodtrucks.com.au/api/1/trucks"

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

from tables import User, Trucks, Votes, Comments

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
        if item[ "category" ] != "":
            me = Trucks(api_key=item[ "truck_id" ], name=item[ "name" ], category=item[ "category" ],
                        picture=item[ 'avatar' ][ 'src' ])
            db.session.add(me)
    db.session.commit()


def truck_cul():
    for value in db.session.query(Trucks.category).distinct():
        if Trucks.query.filter_by(category=value[ 0 ]).count() < 3:
            Trucks.query.filter_by(category=value[ 0 ]).delete()
    db.session.commit()
    if db.session.query(Trucks.category).distinct().count() > 5:
        cats = {}
        for value in db.session.query(Trucks.category).distinct():
            num = Trucks.query.filter_by(category=value[ 0 ]).count()
            cats[ value[ 0 ] ] = num
        final = min(cats.items(), key=lambda x: x[ 1 ])
        Trucks.query.filter_by(category=final[ 0 ]).delete()
        db.session.commit()


def selected_truck(selected_id):
    data = requests.get(api_url)
    final_data = data.json()
    for item in final_data:
        if item[ "truck_id" ] == selected_id:
            return item
    return "error"


def cal_average(truck_id):
    ratings = Votes.query.filter_by(truck_id=truck_id).all()

    speed_list = []
    quality_list = []
    money_list = []
    averages = {}

    for category in ratings:
        speed_list.append(category.speed)
        quality_list.append(category.quality)
        money_list.append(category.money)

    averages["speed"] = sum(speed_list) / len(speed_list)
    averages["quality"] = sum(quality_list) / len(quality_list)
    averages["money"] = sum(money_list) / len(money_list)

    return averages

@app.route("/login_router")
def login_router():
    flash('')
    return render_template("login.html")


@app.route('/')
def main():
    api_data_database()
    truck_cul()
    data = Trucks.query.all()
    return render_template('main.html', data=data)


@app.route('/add_user', methods=[ 'POST' ])
def add_user():
    username = request.form[ 'username' ]
    if User.query.filter_by(username=username).first() is None:
        password = request.form[ 'password' ]
        user_password_hash = pbkdf2_sha256.hash(password)
        user = User(username=username, password=user_password_hash)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        flash('You were successfully signed up')

        return redirect(url_for("main"))
    else:
        flash('That username already exists')
        return render_template("add_user.html")


@app.route('/login', methods=[ 'POST' ])
def login():
    selection_type = request.form[ 'type' ]
    if selection_type == 'add_user':
        return render_template('add_user.html')
    username = request.form[ 'username' ]
    user = User.query.filter_by(username=username).first()
    if user is not None:
        password = request.form[ 'password' ]
        if pbkdf2_sha256.verify(password, user.password):
            login_user(user)
            flash("You where successfully logged in")
            return redirect(url_for("main"))
    flash("Username or Password was incorrect")
    return render_template("login.html")


@app.route('/option_truck/<string:option>', methods=[ 'POST', 'GET' ])
def option_truck(option):
    data = selected_truck(option)
    return render_template('truck.html', data=data, truck_comments = Comments.query.filter_by(truck_id=option).all())


@login_required
@app.route('/comment_create', methods=[ 'POST', 'GET' ])
def comment_create():
    speed = request.form["speed"]
    quality = request.form["quality"]
    money = request.form["money"]
    comment = request.form["comment"]
    truck = request.form["truck"]
    if speed is not None and quality is not None and money is not None:
        vote = Votes(truck_id=truck, user_id=current_user.id, speed=speed, quality=quality, money=money)
        db.session.add(vote)
    if comment is not None:
        user_comment = Comments(truck_id=truck, user_id=current_user.id, comment=comment)
        db.session.add(user_comment)
    db.session.commit()
    return redirect(url_for("option_truck", option=truck))


@app.route("/stats")
def stats():
    return render_template("stats.html")


@app.route("/truck_stats/<string:truck>", methods=['POST', 'GET'])
def truck_stats(truck):
    data = selected_truck(truck)
    return render_template("truck_stats.html", data=data, avrage=cal_average(truck), truck_comments = Comments.query.filter_by(truck_id=truck).all())


@login_required
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main"))


if __name__ == "__main__":
    app.run(debug=True)
