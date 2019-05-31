from flask import Flask, Response, jsonify, request
from time import time
import pymysql

app = Flask(__name__)

@app.route("/")
def hello():
    ret = {
            "code": 200,
            "msg" : "hello world",
            "data": {"time":str(time()),
                "ajax_url":request.args.get("url")
                }
            }
    return jsonify(ret)

@app.route("/lianmen")
def lian():
    return "lianmen cpc ! "+str(time())


@app.route("/log")
def vlog():
    ret = {
            "code": 200,
            "msg" : "log",
            "data": {
                "time":str(time()),
                "ajax_url":request.args.get("url")
                }
            }
    url = request.args.get("url")
    if url == "http://ad.vivo.com.cn/register" :
        '''
        127.0.0.1:3306 easy_log easylog/123456
        '''
        connection = pymysql.connect(host="127.0.0.1",user="easylog",password="123456",db="account",cursorclass=pymysql.cursors.DictCursor)
        try:
            '''
            with connection.cursor() as cursor:
                # Create a new record
                sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
                cursor.execute(sql, ('webmaster@python.org', 'very-secret'))

            # connection is not autocommit by default. So you must commit to save
            # your changes.
            connection.commit()
            '''

            with connection.cursor() as cursor:
                # Read a single record
                sql = "SELECT email,code from t_verification_code order by id desc limit 1 "
                # cursor.execute(sql, ('webmaster@python.org',))
                cursor.execute(sql)
                result = cursor.fetchone()
                ret['code'] = result
        finally:
            connection.close()
    return jsonify(ret)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
