from models import db,cursor
import time

def saveAjax(data):
    initiatorUrl = data['initiator_url']
    ajaxUrl = data['ajax_url']
    createTime = int(time.time())
    cursor.execute("select id from t_ajax_request where initiator_url = '%s' and ajax_url = '%s' "%(initiatorUrl,ajaxUrl))
    if not cursor.fetchone():
        sql = "insert t_ajax_request(initiator_url,ajax_url,create_time) values('%s','%s', %d)" % (initiatorUrl,ajaxUrl,createTime)
        cursor.execute(sql)
        db.commit()
        return cursor.lastrowid
    else:
        return True


def getStageList(initiatorUrl,ajaxUrl):
    sql = "select ar.initiator_url,ar.ajax_url, asr.cmd_format, asr.ajax_id, asr.stage_id, st.connect_str, st.stage_name, st.stage_type" \
          " from t_ajax_request ar join t_ajax_stage_relation asr on ar.id = asr.ajax_id join t_stage st on asr.stage_id = st.id " \
          " where ar.initiator_url = '%s' and ar.ajax_url = '%s'"  %(initiatorUrl,ajaxUrl)
    cursor.execute(sql)
    return cursor.fetchall()


