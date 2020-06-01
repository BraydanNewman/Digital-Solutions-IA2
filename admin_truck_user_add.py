from app import db
from tables import User
from passlib.hash import pbkdf2_sha256


username = input("Username:")
password = input("Password:")
truck_owner = input("Truck Owner(y/n):")
if truck_owner == "y":
    truck_id = input("Truck ID:")


if User.query.filter_by(username=username).first() is None:
    password_hash = pbkdf2_sha256.hash(password)
    if truck_owner == "y":
        user = User(username=username, password=password_hash, rank="truck", owner_truck_id=truck_id)
    else:
        user = User(username=username, password=password_hash, rank="admin")
    db.session.add(user)
    db.session.commit()
