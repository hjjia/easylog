
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
document.addEventListener('DOMContentLoaded', function () {
	console.log(Date.now());
	console.log("loaded",timetrans(Date.now()));
    var data = chrome.extension.getBackgroundPage().logData;
    var ajaxdata = chrome.extension.getBackgroundPage().ajaxRet;

	//console.log('log data',data);
	//console.log('ajax data',ajaxdata);
        //data: JSON.stringify(Data),
    $(".result").html(timetrans(Date.now())+"<br/>"+JSON.stringify(data));
    $(".ajaxresult").html(JSON.stringify(ajaxdata));
});

