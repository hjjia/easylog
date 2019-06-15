import pymysql
import pymysqlpool
from conf.mysql import mysqlConfig

class DbPool:
    
    __pool = None

    def __init__(self,size=10,name="dbpool",config=None):
        self.__pool = pymysqlpool.ConnectionPool(size,name, **config)

    @classmethod
    def getInstance(cls,*args,**kwargs):
        if cls.__pool:
            return cls.__pool
        else:
            cls.__pool = DbPool(*args,**kwargs)
            return cls.__pool


    def fetch_all(self,sql):
        conn = self.__pool.get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql)
            result = cursor.fetchall()
            conn.close()
            return result
        

    def fetch_one(self,sql):
        conn = self.__pool.get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql)
            result = cursor.fetchone()
            conn.close()
            return result
        

    def insert(self,sql):
        conn = self.__pool.get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql)
            conn.commit()
            lastId = cursor.lastrowid
            conn.close()
            return lastId 

    def update(self,sql):
        conn = self.__pool.get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql)
            conn.commit()
            cursor.close()

    def delete(self,sql):
        conn = self.__pool.get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql)
            conn.commit()
            cursor.close()
        


#config={'host':mysqlConfig['host'], 'user':mysql, 'password':'123456', 'database':'easy_log', 'autocommit':True,'charset':'utf8','cursorclass':pymysql.cursors.DictCursor}
mysqlConfig["autocommit"] = True
mysqlConfig["cursorclass"] = pymysql.cursors.DictCursor
Db = DbPool.getInstance(size=10,name="dbpool",config=mysqlConfig)



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
