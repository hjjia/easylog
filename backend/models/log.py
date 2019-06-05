from models import db,cursor
from flask import jsonify
import time

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
    sql = "insert t_log(ajax_id,stage_id, ajax_url, initiator_url, ajax_method,ajax_payload,cmd,logdata,create_time)" \
          " values(%d,%d,'%s',)"%(data['ajax_id'],data['ajax_url'],data['initiator_url'],data['ajax_method'],
                                  jsonify(data['ajax_payload']),jsonify(data['cmd']),jsonify(data['log_data']),int(time.time()))

    cursor.execute(sql)
    db.commit()
    return cursor.lastrowid()

def getLog(initiator):
    sql = "select log_data, ajax_payload from  t_log where initiator_url = '%s' order by id desc limit 10"%(initiator)
    cursor.execute(sql)
    return cursor.fetchall()

