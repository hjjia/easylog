from models import Db
import time


def saveRelation(data):
    sql = "select id from t_ajax_stage_relation where ajax_id = %d and stage_id = %d " % (int(data['ajax_id']), int(data['stage_id']))
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
    cmdForm = data['cmd_format']
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
