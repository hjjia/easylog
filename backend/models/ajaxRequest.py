from models import Db
import time,re

def getList(keyword=""):
    sql = "select distinct(initiator_url) as initiator from t_ajax_request"
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
    sql = "select id from t_ajax_request where host='%s' and  initiator_url = '%s' and ajax_url = '%s' "%(host,initiatorUrl,ajaxUrl)
    if not Db.fetch_one(sql):
        sql = "insert t_ajax_request(host, initiator_url,ajax_url,create_time) values('%s','%s','%s', %d)" % (host,initiatorUrl,ajaxUrl,createTime)
        lastId = Db.insert(sql)
        return lastId
    else:
        return True


def getStageList(initiatorUrl,ajaxUrl):
    sql = "select url_format, from t_ajax_stage_relation";
    urlFormatList = Db.fetch_all(sql)
    for item in urlFormatList:
        urlFormat = item['url_format']
        reObj = re.compile(urlFormat)
        if reObj.match(initiatorUrl) is not None:
            pass

    sql = "select ar.host, ar.initiator_url,ar.ajax_url, asr.cmd_format, asr.ajax_id, asr.stage_id, st.connect_str, st.stage_name, st.stage_type" \
          " from t_ajax_request ar join t_ajax_stage_relation asr on ar.id = asr.ajax_id join t_stage st on asr.stage_id = st.id " \
          " where ar.initiator_url = '%s' and ar.ajax_url = '%s'"  %(initiatorUrl,ajaxUrl)
    return Db.fetch_all(sql)


