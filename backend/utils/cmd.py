from rediscluster import StrictRedisCluster
import paramiko
import re
import json
import pymysql
import datetime


# 执行命令，获取结果



# 要处理多条命令的情况
# cmd_format 就是list类型，支持多条记录
def exec_cmd(data,params):
    stage_type = data['stage_type']
    connect_str = data['connect_str']
    cmd_format = json.loads(data['cmd_format'])
    """
    :param stage_type: 1mysql,2ssh,3redis ....
    :param connect_str: {"host":"127.0.0.1...} 或 [{"host":127.0.0.1,},{"host:192.168.12.2}...]
    :param cmd_format: [select * from t_user where id = ___id___] 或 [ "get ad:creatvie:___id___","hgetall ad:spent:___id___"....]
    :param params: {"id":123,"timestap":1243455...}
    :return:
    """
    # text = "find a replacement for me %(a)s and %(b)s"%dict(a='foo', b='bar')
    mapInfo = json.loads(connect_str)
    if isinstance(mapInfo,dict) and isinstance(params,dict):
        params.update(mapInfo) # 把mapInfo的键值对，更新到params中
    def sub_callback(m):
        return params[m.group(1)]
    cmd = []
    for line in cmd_format:
        cmd.append(re.sub("___([a-zA-Z]+?)___",sub_callback,line))
    if stage_type == 1:
        result = exec_mysql(mapInfo,cmd)
    elif stage_type == 2:
        result = exec_ssh(mapInfo,cmd)
    elif stage_type == 3:
        # todo 兼容多种情况
        result = exec_redis(mapInfo,cmd)
    else:
        result = "not suported cmd type"
    return result

## todo mysql 跨库查询，中间变量的传递

def exec_mysql(dsn,sqls):
    """
    mysql -u [username] -p -e "create database somedb"
    :param dsn:  mysql -u[username] -p[passowrd] -P[port]
    :param sql: ["select * from table1"]
    :return: query result
    """
    db = pymysql.connect(host=dsn["host"],user=dsn["username"],password=dsn["password"],db=dsn["db"],cursorclass=pymysql.cursors.DictCursor)
    cursor = db.cursor()
    result = {}
    for sql in sqls:
        cursor.execute(sql)
        result[sql] = cursor.fetchall()
    return result

def exec_ssh(server,cmds):
    ssh = paramiko.SSHClient()
    #这行代码的作用是允许连接不在know_hosts文件中的主机。
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(server['ip'],  server['port'], server["username"], server["password"])
    result = {}
    for cmd in cmds:
        stdin, stdout, stderr = ssh.exec_command(cmd)
        res = stdout.readlines() # list
        error = stderr.readlines() #list
        result[cmd] = [{
            "stdout":res,
            "stderr":error
        }]
    return result

def exec_redis(redis_nodes,cmd_list):
    '''
        redis_nodes =  [{'host':'10.101.104.132','port':1321},
                        {'host':'10.101.104.132','port':1322},
                        {'host':'10.101.104.132','port':1323}
                        {'host':'10.101.104.132','port':1323,'password':None,'db':0}
                        ]
        cmd_list = [  #暂时只支持read，而且只有这几种
            "get key1",
            "llen lis1",
            "smembers set1",
            "scard set1",
            "hgetall hashtable",
            "lindex list1  2",
            "hget hashtable key1",
            "lrange list1  1 3",
        ]
    '''

    redisconn = StrictRedisCluster(startup_nodes=redis_nodes,decode_responses=True)
    res = {}
    for cmd in cmd_list:
        cmd = cmd.strip()
        arr = re.split(" +",cmd)
        type = arr[0].lower()
        if type ==  'get':
            tmp = redisconn.get(arr[1])
        elif type == 'hgetall':
            tmp = redisconn.hgetall(arr[1])
        elif type == 'llen':
            tmp = redisconn.llen(arr[1])
        elif type == 'smembers':
            tmp = redisconn.smembers(arr[1])
        elif type == 'scard':
            tmp = redisconn.scard(arr[1])
        elif type == 'hget':
            tmp = redisconn.hget(arr[1],arr[2])
        elif type == 'lrange':
            tmp = redisconn.lrange(arr[1],arr[2],arr[3])
        elif type == 'lindex':
            tmp = redisconn.lrange(arr[1],arr[2])
        else:
            tmp = 'this cmd is not support yeild'
        res[cmd] = [json_decode(tmp)]
    return res

def exec_http(url,data):
    return "url,data"

def exec_paas_config(connect,cmd):
    return "connect cmd"


class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj,date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self,obj)


def json_encode(data):
    json_str = json.dumps(data,cls=DateEncoder)
    return json_str.replace("'","#_#_#")

def json_decode(json_str):
    '''
    :param json_str:
    :return:
    '''
    try:
        res = json.loads(json_str)
    except ValueError:
        return json_str
    return res


