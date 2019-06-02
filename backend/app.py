from flask import Flask, Response, jsonify, request
from time import time
import pymysql
from models import user
from utils import cmd

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


@app.route("/add-stage",methods=['post'])
def lian():
    data = request.form.value()
    stageId = stage.addStage(data)
    return jsonify({"id":stageId})




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
    return jsonify(ret)

@app.route("/user-list")
def userList():
    users = user.userList()
    return jsonify(users)

@app.route("/sign")
def signin():
    data = {
            'username':request.args.get("username"),
            'password':"123456"
            }
    lastID = user.signUser(data)
    return jsonify({'id':lastID})

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
