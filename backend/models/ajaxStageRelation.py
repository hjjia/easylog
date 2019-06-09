from models import Db
from flask import jsonify
import time

'''

    ajax_id int not null default 0 comment 'ajax请求id',
    user_id int not null default 0 comment '用户id 0 就是公用的',
    stage_id int not null default 0 comment '步骤id',
    cmd_formatat varchar(2000) not null default '' comment '待执行的命令格式, 可能会有宏替换如 ___host___',
    status  tinyint not null default 1 comment '1是可以，2是不可用'
'''

def saveRelation(data):
    sql = "select id from t_ajax_stage_relation where ajax_id = %d and stage_id = %d"%(int(data['ajax_id']),int(data['stage_id']))
    if not Db.fetch_one(sql):
        sql = "insert t_ajax_stage_relation(ajax_id,user_id,stage_id,cmd_format,create_time) values(%d,%d,%d,'%s',%d)" \
              %(int(data['ajax_id']), 0,int(data['stage_id']),data['cmd_format'],int(time.time()))
        lastId = Db.insert(sql)
        return lastId
    else:
        return True

def updateRelation(data):
    """
    更新 cmd_format
    :param data:
    :return:
    """
    cmdForm = jsonify(data['cmd_format'])
    ajaxId = data['ajax_id']
    stageId = data['stage_id']
    sql = "update t_ajax_stage_relation set cmd_format = '%s' where ajax_id = %d and stage_id = %d "%(cmdForm,ajaxId,stageId)
    Db.update(sql)

def deleteRelation(data):
    '''
    解除步骤和ajax的关联关系
    :param data:
    :return:
    '''
    ajaxId = data['ajax_id']
    stageId = data['stageId']
    sql = "delete t_ajax_stage_relation where ajax_id = %d and stage_id = %d "%(ajaxId, stageId)
    Db.delete(sql)
