
/*
  chrome.storage.sync.get('color', function(data) {
    changeColor.style.background= data.color;
    //changeColor.style.backgroundColor = '#3aa757';
    changeColor.setAttribute('value', 12);
  });
  */



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

console.log("popup",timetrans(Date.now()));
// 相当于点击了插件的icon
//var data = '',ajaxdata = '';
document.addEventListener('DOMContentLoaded', function () {
    var logData = chrome.extension.getBackgroundPage().logData;
    //ajaxdata = chrome.extension.getBackgroundPage().ajaxRet;

    var ret = logData.ret;
    var str = '';
    //Array.prototype.push.apply(arr1,arr2);
    // Object.keys(obj1);
    var result = {};
    for(var i=0; i< ret.length; i++) {
        var itemLog = ret[i].log_data;

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
    //$(".log-data").html(timetrans(Date.now())+"<br/>"+JSON.stringify(logData.ret, undefined,4));
    //timetrans(Date.now())+"<br/><br/>"+
    $(".log-data").html(JSON.stringify(result, undefined,4));
    //$(".ajaxresult").html(JSON.stringify(ajaxdata));
});


/*

// arbitrary js object:
var myJsObj = {a:'foo', 'b':'bar', c:[false,2,null, 'null']};

// using JSON.stringify pretty print capability:
var str = JSON.stringify(myJsObj, undefined, 4);

// display pretty printed object in text area:
document.getElementById('myTextArea').innerHTML = str;


window.onload = function() {
  console.log("onload" + Date())
    data = chrome.extension.getBackgroundPage().logData;
    ajaxdata = chrome.extension.getBackgroundPage().ajaxRet;

    $(".result").html(timetrans(Date.now())+"<br/>"+JSON.stringify(data));
    $(".ajaxresult").html(JSON.stringify(ajaxdata));
}
*/
