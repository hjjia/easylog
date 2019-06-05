#!/usr/bin/env python
#coding:utf-8


from rediscluster import StrictRedisCluster
import sys
import re

"""
class redis.StrictRedis(host='localhost', port=6379, db=0, password=None, socket_timeout=None, connection_pool=None, charset='utf-8', errors='strict', unix_socket_path=None) 
"""
def redis_cluster():
    redis_nodes =  [{'host':'10.101.104.132','port':1321},
                    {'host':'10.101.104.132','port':1322},
                    {'host':'10.101.104.132','port':1323}
                    ]
    try:
        redisconn = StrictRedisCluster(startup_nodes=redis_nodes,decode_responses=True)
    except Exception as e:
        print("Connect Error!")
        sys.exit(1)

    #redisconn.set('name','admin')
    #redisconn.set('age',18)
    #print("name is: ", redisconn.get('name'))
    #print("age  is: ", redisconn.get('age'))
    print(redisconn.get("creative:app:com.DreamonStudios.BouncyBasketball"))
    print(redisconn.get('billing:ad:1'))
    print(redisconn.hgetall('billing:creative:spent:2019040417:5'))

redis_cluster()

map1 = {
    "name":12,
    "age":34
}

map2 = {
    "weight": 65
}
print(map1.update(map2))
print(map1)

for key,item in map2.items():
    map1[key] = item

print(map1)

def re_test():
    params = {
        "host":"127.0.0.1",
        "password":"123456"

    }
    cmd_form = "___host___ ___password___ ___host___"
    def sub_callback(m):
        return params[m.group(1)]
    cmd = re.sub("___(\w+)___",sub_callback,cmd_form)
    print(cmd)

re_test()
