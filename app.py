from flask import Flask, Response, jsonify, request
from time import time

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
    return jsonify(ret)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
