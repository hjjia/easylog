from conf.redis import redisConfig
import redis

class cacheObj:

    __cache = None

    def __init__(self, config=None):
        self.__cache = redis.Redis(**config)

    @classmethod
    def getInstance(cls, *args, **kwargs):
        if cls.__cache:
            return cls.__cache
        else:
            cls.__cache = cacheObj(*args, **kwargs)
            return cls.__cache

    def get(self,key):
        res = self.__cache.get(key)
        return res

    def set(self,key, val):
        res = self.__cache.set(key,val)
        return res

    def delete(self,key):
        return self.__cache.delete(key)

redisConfig['decode_responses'] = True
Cache = cacheObj.getInstance(config=redisConfig)



