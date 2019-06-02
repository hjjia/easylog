from models import db,cursor
import time

def getUser(id=1):
    sql = 'select * from t_user where id = '+ str(id)
    cursor.execute(sql)
    info = cursor.fetchone()
    return info

def userList():
    sql = "select * from t_user order by id desc"
    cursor.execute(sql)
    info = cursor.fetchall()
    return info

def signUser(data):
    ctime = str(int(time.time()))
    sql = "INSERT INTO `t_user` (`username`, `password`,`create_time`) VALUES (%s, %s,%s)"
    cursor.execute(sql, (data['username'], data['password'],ctime))
    # connection is not autocommit by default. So you must commit to save
    # your changes.
    db.commit()
    return cursor.lastrowid
