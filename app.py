from flask import render_template, Flask, sessions, request, redirect, url_for
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database\\food_truck.sqlite'
app.config['SECRET_KEY'] = 'secret_key'


db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    truck_owner = db.Column(db.Integer)
    owner_truck_name = db.Column(db.String)
    # comment = relationship("Comments")
    # vote = relationship("Votes")
    

class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    # user_id = db.Column(db.Integer, ForeignKey('User.id'))


class Votes(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    # user_id = db.Column(db.Integer, ForeignKey("User.id"))
    truck_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)


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


@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    password = request.form['password']

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
    db.create_all()
    db.session.commit()
    app.run(debug=True)
