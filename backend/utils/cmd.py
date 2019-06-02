# 执行命令，获取结果
def exec_cmd(connect_str,cmd_form,params):
    return "result"

def exec_mysql(dsn,sql):
    return "sql"

def exec_ssh(server,cmd):
    return "ssh_bash_cmd"

def exec_redis(redis,cmd):
    return "redis cmd"

def exec_http(url,data):
    return "url,data"

def exec_paas_config(connect,cmd):
    return "connect cmd"


