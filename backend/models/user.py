from models import db,cursor
import time

def getUser():
    sql = 'select * from t_user order by id desc limit 1'
    cursor.execute(sql)
    info = cursor.fetchone()
    db.close()
    return info

def userList():
    sql = "select * from t_user order by id desc"
    cursor.execute(sql)
    info = cursor.fetchall()
    db.close()
    return info

def signUser(data):
    ctime = str(int(time.time()))
    sql = "INSERT INTO `t_user` (`username`, `password`,`create_time`) VALUES (%s, %s,%s)"
    cursor.execute(sql, (data['username'], data['password'],ctime))
    # connection is not autocommit by default. So you must commit to save
    # your changes.
    db.commit()
    db.close()
