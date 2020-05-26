from flask import render_template, Flask, sessions, request, redirect, url_for
import requests, json, sqlite3
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database\\food_truck.sqlite'
app.config['SECRET_KEY'] = 'secret_key'


db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def api_data_clean():
    url = "https://www.bnefoodtrucks.com.au/api/1/trucks"
    data = requests.get(url)
    sessions['trucks'] = data.json()


@app.route('/')
def hello():
    return render_template('login.html')


@app.route('/add_user')
def add_user():
    username = request.form['username']
    password = request.form['password']
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return render_template("base.html")


@app.route('/login', methods=['POST'])
def login():
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
