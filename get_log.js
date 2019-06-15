
var host = "http://www.a.com:5000";
var url2 = host + '/get-log'; // 获取日志内容

var addr_url = document.location.href;
alert(addr_url);
var logData = {};
$.ajax({
        url: url2, //  host + '/get-log'; // 获取日志内容
        type: "get",
        data: {"url":addr_url},
        async:false,
        dataType:"json",
        success:function(msg){
            logData.ret = msg;
            //alert(JSON.stringify(msg));
            //console.log('log',msg);
        },
        error:function(err) {
            //console.log(err)
        }
    });

return logData;

