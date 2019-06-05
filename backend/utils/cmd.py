from rediscluster import StrictRedisCluster
import paramiko
import re
import json
import pymysql


# 执行命令，获取结果



# todo 要处理多条命令的情况
def exec_cmd(stage_type,connect_str,cmd_form,params):
    # text = "find a replacement for me %(a)s and %(b)s"%dict(a='foo', b='bar')
    mapInfo = json.loads(connect_str)
    #for key, val in params.items():
    #    mapInfo[key] = val
    params.update(mapInfo) # 把mapInfo的键值对，更新到params中
    def sub_callback(m):
        return params[m.group(1)]
    cmd = re.sub("___(\w+)___",sub_callback,cmd_form)
    if stage_type == 1:
        exec_mysql(mapInfo,cmd)
    elif stage_type == 2:
        exec_ssh(mapInfo,cmd)
    elif stage_type == 3:
        # todo 兼容多种情况
        exec_redis(mapInfo,cmd)
    return "result"

def exec_mysql(dsn,sql):
    """
    mysql -u [username] -p -e "create database somedb"
    :param dsn:  mysql -u[username] -p[passowrd] -P[port]
    :param sql: "select * from table1"
    :return: query result
    """
    db = pymysql.connect(host=dsn["host"],user=dsn["username"],password=dsn["password"],db=dsn["database"],cursorclass=pymysql.cursors.DictCursor)
    cursor = db.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    return result

def exec_ssh(server,cmd):
    ssh = paramiko.SSHClient()
    #这行代码的作用是允许连接不在know_hosts文件中的主机。
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(server['ip'],  server['port'], server["username"], server["password"])
    stdin, stdout, stderr = ssh.exec_command(cmd)
    res = stdout.readlines() # list
    error = stderr.readlines() #list
    if error:
        return error
    else:
        return res

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
    if isinstance(cmd_list,str):
        cmd_list = [cmd_list]
    for cmd in cmd_list:
        cmd = cmd.strip()
        arr = re.split(" +",cmd)
        type = arr[0].lower()
        if type ==  'get':
            res[cmd] = redisconn.get(arr[1])
        elif type == 'hgetall':
            res[cmd] = redisconn.hgetall(arr[1])
        elif type == 'llen':
            res[cmd] = redisconn.llen(arr[1])
        elif type == 'smembers':
            res[cmd] = redisconn.smembers(arr[1])
        elif type == 'scard':
            res[cmd] = redisconn.scard(arr[1])
        elif type == 'hget':
            res[cmd] = redisconn.hget(arr[1],arr[2])
        elif type == 'lrange':
            res[cmd] = redisconn.lrange(arr[1],arr[2],arr[3])
        elif type == 'lindex':
            res[cmd] = redisconn.lrange(arr[1],arr[2])
        else:
            res[cmd] = 'this cmd is not support yeild'
    return res

def exec_http(url,data):
    return "url,data"

def exec_paas_config(connect,cmd):
    return "connect cmd"


