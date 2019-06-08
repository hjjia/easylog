 chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      // open a new tab,direact to the README
      console.log('welcome! star or issue on my github: https://github.com/helloworldcoding/easylog');
    });

  });


// https://blog.csdn.net/hhmouse111/article/details/36901527
// https://www.cnblogs.com/guogangj/p/3235703.html
//https://www.moesif.com/blog/technical/apirequest/How-We-Captured-AJAX-Requests-with-a-Chrome-Extension/
//chrome.webRequest.onBeforeRequest.addListener (
//chrome.webRequest.onResponseStarted.addListener (

function parseUrl(url) {
    var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query)) {
       urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;

}
/*

*/

var currentUrl = '';
var ajaxRet = {};
var host = "http://www.a.com:5000";
var url1 = host+'/ajax-request'; // 触发记录日志的ajax请求
var url2 = host + '/get-log'; // 获取日志内容
//chrome.webRequest.onCompleted.addListener (
chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
		//if(details.url.indexOf('used_by_contents') != -1) {
		if(details.type == "xmlhttprequest"){
			if(details.url.indexOf(host) == -1 
				&& details.url.indexOf("http://chrome-extension") == -1
				&& details.url.indexOf("https://chrome-extension") == -1
				&& details.url.indexOf("chrome://extensions") ==  -1
			) {
                //console.log('ajax_url',details.url);
                //console.log(details.statusCode);
                //  获取ajax请求的参数
				console.log('details',details);
                var params = {};
                if(details.method == 'POST') {
					if (details.requestBody.formData) {  // form表单的格式
						params = details.requestBody.formData;
					} else if (details.requestBody.raw) { // post请求的数据，raw格式
						var postedString = details.requestBody.raw.map(function(data) { return String.fromCharCode.apply(null, new Uint8Array(data.bytes)) }).join('');
						params = JSON.parse(postedString);
					} else {
						console.log('not support post data type',details.requestBody)
					}
                } else {
                    params =  parseUrl(details.url);
                }

				chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
					    console.log('chrome.tabs.query',tabs[0].url);
					   currentUrl = tabs[0].url;
				});

				/*,getSelected将要被废弃
				chrome.tabs.getSelected(null, function(tab) {
					currentUrl  = tab.url;
					console.log('chrome.tabs.getSetected',currentUrl)
				});
				*/


                params['easylog_generatelog_url'] = details.url;
				params['host'] = details.initiator; // 地址栏host,只有域名，没有路径 http://www.bb.com
                params['easylog_initiator'] = currentUrl; //地址栏 http://www.bbb.com/123123/2343242
                params['location_href'] = window.location.href; // chrome-extension://kpkhgljdoibppbphdelmgcadephnkakn/_generated_background_page.html
				$.ajax({
					type: "post", // 一般用 POST 或 GET 方法
					// 请求后端，获取日志信息
					url: url1, // 要请求的地址
					dataType: "json", // 服务器返回的数据类型，可能是文本 ，音频 视频 script 等浏览 （MIME类型）器会采用不同的方法来解析。
					data:params,
					success:function(msg){
						ajaxRet = msg;
						console.log("ajax return", msg);// 成功之后执行这里面的代码
					},
					error:function(e){
						console.log(e)//请求失败是执行这里的函数
					}
				});
			} 
		}
    },

    {urls:["*://*/*"]},  //监听页面请求,你也可以通过*来匹配。
    ["requestBody"]
);

// 切换tab 回调
changeTab = function(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
}
// oUpdated
/*
onUpdated 事件
URL更新事件监听， 一般访问一个URL会触发两次，
访问的时候触发，状态为loading,
访问完成的时候触发 状态为complete
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    if (tab.status === 'loading') {
        updateBrowserAction(id, tab.url);
    }
});
*/
// chrome.tabs.onUpdated.addListener(changeTab);
// tab被激活
//当tab页被激活的时候触发
//即切换tab页，或者打开关闭tab都会触发。

//todo 切换tab，popup页面也要对应刷新
chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (activeInfo.tabId) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
           // updateBrowserAction(tab.id, tab.url);
			console.log("change tab ",activeInfo);
        });
    }
});

var logData = {};
// 监听content_sript.js发送过来的数据 var msg = { "title": $("title").html(), "url": window.location.href}
// 调用后端接口，分析页面上的内容
// 通过当前url，获取当前页面，曾经发生的ajax请求,以及他们的日志信息

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	logData = request; // request 就是content_script发送过来的json串 ,通过地址栏里的url，获取该路径下的ajax请求产生的日志列表
    $.ajax({
        url: url2,
        type: "get",
        data: logData,
        dataType:"json",
        success:function(msg){
            logData.ret = msg;
            console.log('log',msg);
        },
        error:function(err) {
            console.log(err)
        }
    });
});
