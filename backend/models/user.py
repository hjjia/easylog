from models import Db
import time

def getUser(id=1):
    sql = 'select * from t_user where id = '+ str(id)
    return Db.fetch_one(sql)

def userList():
    sql = "select * from t_user order by id desc"
    return Db.fetch_all(sql) 

def signUser(data):
    ctime =int(time.time())
    sql = "INSERT INTO `t_user` (`username`, `password`,`create_time`) VALUES ('%s', '%s',%d)"%(data['username'], data['password'],ctime)
    return Db.insert(sql)
