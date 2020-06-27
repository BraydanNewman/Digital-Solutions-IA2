# List of all the extra Imported libraries and modules for extra functionality
from os import path
import requests
import time
from flask import render_template, Flask, request, flash, redirect, url_for
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256

# START SETUP
# This set up section sets a few necessary parameters for the rest of the code to function
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/food_truck.sqlite'
app.config['SECRET_KEY'] = 'secret_key'

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
# END SETUP


# Required by Flask_login to set up its functionality
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Retrieves all the data from the api and transfers it to JSON variable
# Then deletes all data in table to then put the new up to data into the table
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


# Gets rid of the trucks that are unwanted in the system
# Unwanted trucks include trucks that have less than 3 trucks in a category
# and max of 5 category's
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


# Gathers all data with on an accosted truck from the id
def selected_truck(selected_id):
    data = requests.get(api_url)
    final_data = data.json()
    for item in final_data:
        if item["truck_id"] == selected_id:
            return item
    return "error"


# Calculates all the averages of the 3 different votes for any truck
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

    if sum(speed_list) != 0 and len(speed_list) != 0:
        averages["speed"] = sum(speed_list) / len(speed_list)
    if sum(quality_list) != 0 and len(quality_list) != 0:
        averages["quality"] = sum(quality_list) / len(quality_list)
    if sum(money_list) != 0 and len(money_list) != 0:
        averages["money"] = sum(money_list) / len(money_list)

    return averages


# Route is called when user selects login to get set to login page
@app.route("/login_router")
def login_router():
    flash('')
    return render_template("login.html")


# Main login route for the base URL
@app.route('/')
def main():
    api_data_database()
    truck_cul()
    data = Trucks.query.all()
    return render_template('main.html', data=data)


# Adds users to the database
# Gathers all required data from form and checks that the username doesnt already exist in database
# then encrypts the password and adds all data to the database
@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    if User.query.filter_by(username=username).first() is None:
        password = request.form['password']
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


# Verifies the user and logs them in
# Gathers all required info from the form and checks that the username in in the data base
# if so verifies the encrypted password against the user input password
# if verified user is logged into the system
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
            return redirect(url_for("main"))
    flash("Username or Password was incorrect")
    return render_template("login.html")


# Gets the selected truck from the user and displays the selected trucks content on a page
@app.route('/option_truck/<string:option>', methods=[ 'POST', 'GET' ])
def option_truck(option):
    data = selected_truck(option)
    return render_template('truck.html', data=data, truck_comments=Comments.query.filter_by(truck_id=option).all())


# Gets all the inputted values from user and adds them to the database under that trucks id
# The Creating comment is protected by a login and thus only users that have logged in can create a comment
@login_required
@app.route('/comment_create', methods=['POST', 'GET'])
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


# Displays all the trucks averages for the admin
@app.route("/stats")
def stats():
    truck_data = []
    num = Trucks.query.all()
    for item in num:
        truck_data.append(cal_average(item.api_key))
    return render_template("stats.html", data=truck_data, count=num)


# Gets and displays all the truck averages to the owner of a given truck
@app.route("/truck_stats/<string:truck>", methods=['POST', 'GET'])
def truck_stats(truck):
    data = selected_truck(truck)
    return render_template("truck_stats.html", data=data, avrage=cal_average(truck),
                           truck_comments=Comments.query.filter_by(truck_id=truck).all())


# Logs the the out and erases all temporary data stored in there session
@login_required
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main"))


# Stats the server
if __name__ == "__main__":
    app.run(debug=True)
