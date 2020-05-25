food_truck_update_sql = '''
    INSERT INTO food_truck_vote (email, password) VALUES (?, ?)
'''

add_user_sql = '''
    INSERT INTO users (username, password) VALUES (?, ?)
'''

get_user_login_sql = '''
    SELECT password 
    FROM users
    WHERE username == ?
'''

get_user_login_sql_id = '''
    SELECT username, AlternateID
    FROM users
    WHERE user_id == ?
'''
