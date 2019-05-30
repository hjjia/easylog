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


/*

*/
var ajaxRet = {};
var host = "http://www.a.com:5000";
var url1 = host+'/'; // 触发记录日志的ajax请求
var url2 = host + '/log'; // 获取日志内容
chrome.webRequest.onCompleted.addListener (

    function(details) {
		//if(details.url.indexOf('used_by_contents') != -1) {
		if(details.type == "xmlhttprequest"){
			console.log('ajax_url',details.url);
			//console.log(details.statusCode);
			//console.log('details',details);
			if(details.url.indexOf(host) == -1) {
				$.ajax({
					method: "GET", // 一般用 POST 或 GET 方法
					// 请求后端，获取日志信息
					url: url1, // 要请求的地址
					dataType: "json", // 服务器返回的数据类型，可能是文本 ，音频 视频 script 等浏览 （MIME类型）器会采用不同的方法来解析。
					data:{ //发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo: ["bar1", "bar2"]} 转换为 "&foo=bar1&foo=bar2"。
						url: details.url
					},
					success(msg){
						ajaxRet = msg;
						console.log("ajax return", msg);// 成功之后执行这里面的代码
					},
					error(e){
						console.log(e)//请求失败是执行这里的函数
					}
				});
			} 
		}
        chrome.tabs.query({active:true},function(tab){
            // 当前页面的url
            var pageUrl = tab[0].url;
            // 在这可以写判断逻辑，将请求cancel掉，或者将请求打印出来
            //console.log("current url ==> " + pageUrl);
            //console.log("current tab -> " , tab);
        });

    },

    {urls:["*://*/*"]},  //监听页面请求,你也可以通过*来匹配。
    ["responseHeaders"]
);

// 切换tab 回调
changeTab = function(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
}
// 切换tab
chrome.tabs.onUpdated.addListener(changeTab);

var logData = {};
// 监听content_sript.js发送过来的数据 var msg = { "title": $("title").html(), "url": window.location.href}
// 调用后端接口，分析页面上的内容
// 通过当前url，获取当前页面，曾经发生的ajax请求,以及他们的日志信息

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	logData = request; // request 就是content_script发送过来的json串 ,通过地址栏里的url，获取该路径下的ajax请求产生的日志列表
    $.ajax({
        url: url2,
        cache: false,
        type: "get",
        //data: JSON.stringify(Data),
        data: logData,
        dataType: "json"
    }).done(function(msg) {
        logData.ret = msg;
        console.log('log',msg);
    }).fail(function(jqXHR, textStatus) {
        console.log("failed");
    });
});
