from models import Db
import time,re

def getList(keyword=""):
    sql = "select distinct(url_format) as initiator from t_ajax_request"
    res = Db.fetch_all(sql)
    return res

    """
    db.ping(reconnect=True)
    cursor.execute(sql)
    return cursor.fetchall()
    """

def saveAjax(data):
    initiatorUrl = data['initiator_url']
    ajaxUrl = data['ajax_url']
    host = data['host']
    createTime = int(time.time())
    req = getOne(initiatorUrl,ajaxUrl)
    if req is None:
        sql = "insert t_ajax_request(host, url_format,ajax_url,create_time) values('%s','%s','%s', %d)" % (host,initiatorUrl,ajaxUrl,createTime)
        lastId = Db.insert(sql)
        return lastId
    else:
        return True

def updateUrlFormat(data):
    sql = "update t_ajax_request set url_format = '%s' where id = %d" %(data['url_format'], data['id'])
    Db.update(sql)


def getStageList(initiatorUrl,ajaxUrl):
    '''
    返回该地址栏下 某个ajax请求相关的步骤列表
    :param initiatorUrl: 地址栏
    :param ajaxUrl: ajax请求的url
    :return:
    '''
    req = getOne(initiatorUrl,ajaxUrl)
    print('req',req)
    if req :
        sql = " select ar.host, ar.url_format, ar.ajax_url, asr.cmd_format, asr.ajax_id, asr.stage_id, st.connect_str, st.stage_name, st.stage_type" \
              " from t_ajax_request ar join t_ajax_stage_relation asr on ar.id = asr.ajax_id " \
              " join t_stage st on asr.stage_id = st.id " \
              " where ar.id = %d"  %(req['id'])
        return Db.fetch_all(sql)
    return None



def getOne(initiatorUrl,ajaxUrl):
    '''
    通过地址栏和ajax请求的url，返回已有的请求信息
    :param initiatorUrl:
    :param ajaxUrl:
    :return:
    '''
    sql = "select id, url_format, ajax_url from t_ajax_request where ajax_url = '%s'" %(ajaxUrl)
    urlFormatList = Db.fetch_all(sql)
    for item in urlFormatList:
        urlFormat = item['url_format']
        reObj = re.compile(urlFormat)
        if initiatorUrl == urlFormat or (reObj.match(initiatorUrl) is not None):
            return item
    return None

