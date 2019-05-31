from models import db,cursor

def getUser():
    sql = 'select * from user order by id desc limit 1'
    cursor.execute(sql)
    info = cursor.fetchone()
    db.close()
    return info

def signUser(data):
    ctime = int(time.time())
    sql = "INSERT INTO `users` (`username`, `password`,`create_time`) VALUES (%s, %s,%d)"
    cursor.execute(sql, (data['username'], data['password'],ctime))
    # connection is not autocommit by default. So you must commit to save
    # your changes.
    db.commit()
    db.close()
