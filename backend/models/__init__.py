import pymysql

db = pymysql.connect(host="127.0.0.1",user="easylog",password="123456",db="easy_log",cursorclass=pymysql.cursors.DictCursor)
cursor = db.cursor()
'''
try:

    with connection.cursor() as cursor:
        # Create a new record
        sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
        cursor.execute(sql, ('webmaster@python.org', 'very-secret'))

    # connection is not autocommit by default. So you must commit to save
    # your changes.
    connection.commit()

    with connection.cursor() as cursor:
        # Read a single record
        sql = "SELECT email,code from t_verification_code order by id desc limit 1 "
        # cursor.execute(sql, ('webmaster@python.org',))
        cursor.execute(sql)
        result = cursor.fetchone()
        ret['code'] = result
finally:
    connection.close()
'''
