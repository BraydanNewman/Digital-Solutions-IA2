from flask_login import UserMixin
from app import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    rank = db.Column(db.String)
    owner_truck_name = db.Column(db.String)


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)
    comment = db.Column(db.String)


class Votes(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    truck_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)


class Trucks(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    api_key = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
