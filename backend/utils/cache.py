from utils.cmd import json_decode,json_encode

cache_file = "./cache_data"
def get(key):
    with open(cache_file,'rt') as f:
        jsonData = f.read()
        dictData = json_decode(jsonData)
        val = dictData[key]
        return val.replace("#_#_#","'")

def set(key,val):
    if isinstance(val,str):
        val = val.replace("'","#_#_#")
    else:
        return False

    with open(cache_file,'rt') as f:
        jsonData = f.read()
        if not jsonData:
            dictData = {}
        else:
            dictData = json_decode(jsonData)
        dictData[key] = val

    with open(cache_file,'wt') as f:
        data = json_encode(dictData)
        f.write(data)
        return True


def delete(key):
    with open(cache_file,'rt') as f:
        jsonData = f.read()
        if not jsonData: # 没有数据，直接返回
            return True
        else:
            dictData = json_decode(jsonData)
            if key not in dictData: # 不存在这个key
                return True
            del dictData[key]

    with open(cache_file,'wt') as f:
        data = json_encode(dictData)
        f.write(data)
        return True


