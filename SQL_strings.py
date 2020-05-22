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
