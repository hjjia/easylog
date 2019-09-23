from models import Db
import time


def saveRelation(data):
    try:
        for item in data:
            sql = "select id from t_page_stage_relation where page_url = '%s' and stage_id = %d and cmd_format = '%s' " % (item['page_url'], int(item['stage_id']),item['cmd_format'])
            if not Db.fetch_one(sql):
                sql = "insert t_page_stage_relation(page_url,user_id,stage_id,cmd_format,create_time) values('%s',%d,%d,'%s',%d)" \
                      %(item['page_url'], 0,int(item['stage_id']),item['cmd_format'],int(time.time()))
                Db.insert(sql)
        return True
    except Exception as err:
        print(err)
        return False

def updateRelation(data):
    """
    更新 cmd_format
    :param data:
    :return:
    """
    cmdForm = data['cmd_format']
    ajaxId = data['ajax_id']
    stageId = data['stage_id']
    sql = "update t_page_stage_relation set cmd_format = '%s' where ajax_id = %d and stage_id = %d "%(cmdForm,ajaxId,stageId)
    Db.update(sql)

def deleteRelation(data):
    '''
    解除步骤和ajax的关联关系
    :param data:
    :return:
    '''
    ajaxId = data['ajax_id']
    stageId = data['stageId']
    sql = "delete t_page_stage_relation where ajax_id = %d and stage_id = %d "%(ajaxId, stageId)
    Db.delete(sql)
