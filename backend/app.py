from flask import Flask, Response, jsonify, request
from time import time
from models import user,stage,ajaxRequest,log,ajaxStageRelation
from utils import cmd,cache
from urllib.parse import urlparse

app = Flask(__name__)

successRet = {
    "code":200,
    "msg":"success",
    "data":[]
}

failRet = {
    "code":400,
    "msg":"faied",
    "data":[]
}

'''
from routes import *
可以把各种路由，写在routes.py的文件中，
从而简化app.py的内容
'''
## ajax请求，产生日志记录
@app.route("/ajax-request",methods=["post"])
def hello():
    data = dict(request.form)
    if not data or not ('ajax_method' in data) :
        return "必要参数缺失"
    url = data['easylog_generatelog_url'] # ajax请求url
    res = urlparse(url)
    # ParseResult(scheme='http', netloc='www.aa.com.cn:8908', path='/asdfasf/teste', params='', query='id=12&name=asfsdfd', fragment='')
    ajax_url = res.scheme+"://"+res.netloc+res.path
    initiator = data['easylog_initiator'] # 地址栏
    # todo 根据ajax请求的ajax_url,和地址栏，找到关联的stage，并且，执行相应的命令，获取指定步骤下的日志信息。并保存到表中
    ajaxRequest.saveAjax({"host":data['host'],"initiator_url":initiator,"ajax_url":ajax_url})
    stageList = ajaxRequest.getStageList(initiator,ajax_url)
    try:
        for stage in stageList:
            logData = stage
            logData['ajax_payload'] = data
            logData['ajax_method'] = data['ajax_method']
            logData['initiator_url'] = initiator
            logData['ajax_url'] = ajax_url
            logData['log_data'] = cmd.exec_cmd(stage,data)
            log.saveLog(logData)
    except Exception as err:
        return jsonify(err)

    return jsonify(successRet)

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


@app.route("/add-stage-ajax-relation",methods=['post'])
def relation():
    data = {
            "stage_id":1,
            "ajax_id":1,
            "cmd_format":"select * from t_ajax_request where id = ___id___"
            }
    data = request.form
    ajaxStageRelation.saveRelation(data)
    return jsonify(data)

@app.route("/ajax-request-list")
def ajax_request_list():
    res = ajaxRequest.getList()
    return jsonify(res)

@app.route("/cache")
def cache_test():
    key = request.args.get("key")
    cache.set(key,"val")
    cache.set("name","zhangsan")
    name = cache.get("name")
    cache.delete("name")
    cache.set("age",12)
    return jsonify({"name":name})



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
