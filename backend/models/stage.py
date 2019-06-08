from models import db,cursor
import time

def addStage(data):
    stageName = data['stage_name']  
    connectStr = data['connect_str']
    stageType = int(data['stage_type'])
    createTime = int(time.time())
    sql = "insert t_stage(stage_name,connect_str,stage_type,create_time) values('%s','%s', %d, %d)" % (stageName,connectStr,stageType,createTime)
    db.ping(reconnect=True)
    cursor.execute(sql)
    db.commit()
    return cursor.lastrowid

def stageList():
    sql = "select * from t_stage order by id desc"
    db.ping(reconnect=True)
    cursor.execute(sql)
    return cursor.fetchall()
