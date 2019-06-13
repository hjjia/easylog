from models import Db
import time,datetime
from utils.cmd import json_encode,json_decode

'''    id int not null primary key auto_increment,
    ajax_id int not null default 0 comment 'ajax请求id',
    user_id int not null default 0 comment '用户id',
    stage_id int not null default 0 comment '步骤id',
    ajax_url varchar(1000) not null default '' comment 'ajax请求url',
    initiator_url varchar(1000) not null default '' comment 'ajax请求时的地址栏',
    ajax_method char(10) not null default 'get' comment '请求方法get/post',
    ajax_payload text comment '请求的数据',
    cmd varchar(1000) not null default ''  comment '获取信息，执行的命令',
    log_data text comment '对应的步骤下的日志信息',
    create_time int not null default 0 comment '创建时间',
    status tinyint not null default 1 comment '1有效，2无效'
    
'''


def saveLog(data):
    sql = "insert t_log(ajax_id,stage_id, ajax_url, initiator_url, ajax_method,ajax_payload,cmd,log_data,create_time)" \
          " values(%d,%d,'%s','%s','%s','%s','%s','%s',%d)"%(data['ajax_id'],data['stage_id'],data['ajax_url'],data['initiator_url'],data['ajax_method'],
                                  json_encode(data['ajax_payload']),json_encode(data['cmd_format']),json_encode(data['log_data']),int(time.time()))

    return Db.insert(sql)

def getLog(initiator):
    sql = "select log_data, ajax_payload from  t_log where initiator_url = '%s' order by id desc limit 10"%(initiator)
    data = Db.fetch_all(sql)
    res = []
    for item in data:
        res.append({
            "log_data":json_decode(item['log_data']),
            "ajax_payload":json_decode(item['ajax_payload'])
        })
    return res

