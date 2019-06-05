from flask import Flask, Response, jsonify, request
from time import time
from models import user,stage,ajaxRequest,log
from utils import cmd
from urllib.parse import urlparse

app = Flask(__name__)

## ajax请求，产生日志记录
@app.route("/ajax-request",methods=["post"])
def hello():
    data = request.form
    url = data['easylog_generatelog_url'] # ajax请求url
    res = urlparse(url)
    # ParseResult(scheme='http', netloc='www.aa.com.cn:8908', path='/asdfasf/teste', params='', query='id=12&name=asfsdfd', fragment='')
    ajax_url = res.scheme+"://"+res.netloc+res.path
    initiator = data['easylog_initiator'] # 地址栏
    # todo 根据ajax请求的ajax_url,和地址栏，找到关联的stage，并且，执行相应的命令，获取指定步骤下的日志信息。并保存到表中
    ajaxRequest.saveAjax({"initiator_url":initiator,"ajax_url":ajax_url})
    stageList = ajaxRequest.getStageList(initiator,ajax_url)
    for stage in stageList:
        logData = stage
        logData['log_data'] = cmd.exec_cmd(stage,data)
        logData['payload'] = data
        logData['initiator_url'] = url
        logData['ajax_url'] = ajax_url
        log.saveLog(logData)

    return jsonify(data)

# 返回日志信息
@app.route("/get-log")
def vlog():
    url = urlparse(request.args.get("url"))
    initiator = url.scheme + "://" +url.netloc + url.path #地址栏
    ret = log.getLog(initiator)
    return jsonify(ret)



@app.route("/add-stage",methods=['post'])
def lian():
    data = request.form
    stageId = stage.addStage(data)
    return jsonify({"id":stageId})

@app.route("/stage-list",methods=['get'])
def stage_list():
    res = stage.stageList()
    return jsonify(res)




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
