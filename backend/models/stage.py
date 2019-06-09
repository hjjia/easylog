from models import Db
import time

def addStage(data):
    stageName = data['stage_name']  
    connectStr = data['connect_str']
    stageType = int(data['stage_type'])
    createTime = int(time.time())
    sql = "insert t_stage(stage_name,connect_str,stage_type,create_time) values('%s','%s', %d, %d)" % (stageName,connectStr,stageType,createTime)
    print(sql)
    return Db.insert(sql)

def stageList():
    sql = "select * from t_stage order by id desc"
    return Db.fetch_all(sql)
