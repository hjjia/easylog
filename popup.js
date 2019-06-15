// 时间戳 转化为字符串格式
function timetrans(date){
		if(String(date).length < 13) {
	    	var date = new Date(date*1000);//如果date不足13位,需要乘1000
		} else {
	    	var date = new Date(date);//如果date为13位不需要乘1000
		}
	    var Y = date.getFullYear() + '-';
	    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
	    return Y+M+D+h+m+s;
}

var host = "http://www.a.com:5000";
var url1 = host+'/ajax-request'; // 触发记录日志的ajax请求
var url2 = host + '/get-log'; // 获取日志内容

$(".js-btn").on("click",function(){
    chrome.tabs.executeScript({
        code:"url = document.location.href;" // 在popup页面获取浏览器地址
    },function(res){
        var params = {'url':res[0]}; // res是executeScript执行脚本返回值，是一个数组。
        var logData = [];
        $.ajax({
            url: url2, //  host + '/get-log'; // 获取日志内容
            type: "get",
            data: params,
            async:false,
            dataType:"json",
            success:function(msg){
                logData = msg;
                //console.log('log',msg);
            },
            error:function(err) {
                alert(err);
            }
        });


        //Array.prototype.push.apply(arr1,arr2);
        // Object.keys(obj1);
        var result = {};
        for(var i=0; i< logData.length; i++) {
            var itemLog = logData[i].log_data;
            if(typeof(itemLog) == 'string') {
                result[i] = itemLog;
            }else if( typeof(itemLog) == "object" ) {
                for (var key in itemLog) { //// 每条日志记录的 命令
                    if(!result.hasOwnProperty(key)) {
                        result[key] = [];
                    }
                    Array.prototype.push.apply(result[key], itemLog[key])
                }
            }
        }
        $(".log-data").html(JSON.stringify(result, undefined,4));
    });
})


