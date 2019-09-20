
// ID, email, timestamp, date, address, 随机数(0~1)
// editable = false  可以考虑 用confirm弹框来确认

/*
editable: true
frameId: 0
menuItemId: "menuID"
pageUrl: "https://id.vivo.com.cn/?_201909041631#!/first/aptitude/create"
selectionText: "oi..t"
*/
var menus = [
    //{title: '1~100之间的随机数', id: 'menuRandomInteger'},  // 
    {title: '解析选中内容', id: 'menuSelectText'},  // 
    {title: '获取后端信息', id: 'menuBackendInfo'},  // 
    {title: '身份证号码', id: 'menuID'},  // 18位
    {title: '手机号码', id: 'menuMobile'},  // 11位
    {title: '银行卡号', id: 'menuBankCardNo'},  // 
    {title: 'email', id: 'menuEmail'},  // 
    {title: '5个随机汉字', id: 'menuChinese'},  //
    {title: '5个随机特殊字符', id: 'menuSpecialChars'},  //
    {title: '当前时间戳', id: 'menuTimestamp'},  // 
    {title: '当前日期时间', id: 'menuDate'},  // 
    //{title: '一小时后', id: 'menuAnhourLater'},  // 
];

// 创建菜单 
for(var i=0;i < menus.length; i++) {
    menu = menus[i];
    menu['type']  = 'normal';
    menu['contexts'] = ['all'];
    menu['onclick'] = genericOnClick;
    chrome.contextMenus.create(menu);
}

// 右键菜单 邮箱地址 
/*
chrome.contextMenus.create({ type: 'normal', title: 'email', id: 'menuEmail', contexts: ['all'], onclick: genericOnClick }, function () {
    console.log('contextMenus are create.');
});
*/


function genericOnClick(info, tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // 把信息发送到 content_script中
        chrome.tabs.sendMessage(tabs[0].id, info, function(response) {
          console.log('sending',info);
        });
      });
}



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
            query  = url.substr(url.indexOf("?")+1);

    var urlParams = {};
    while (match = search.exec(query)) {
       urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;

}
/*

*/



var currentUrl = '';
var currentActiveUrl = '';
var ajaxRet = {};
var host = "http://www.a.com:5000";
var url1 = host+'/ajax-request'; // 触发记录日志的ajax请求
var url2 = host + '/get-log'; // 获取日志内容


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
// 只记录当前tab的请求
chrome.tabs.onActivated.addListener(function (activeInfo) {
    //console.log('切换tab',Date.now())
    if (activeInfo.tabId) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
			currentUrl = tab.url;
        });
    }
});



// chrome.webRequest.onBeforeRequest.addListener(

    /*
    function(details) {
        chrome.tabs.query({'active': true,'highlighted':true, 'lastFocusedWindow': true}, function (tabs) {
               currentActiveUrl = tabs && tabs[0] && tabs[0].url;
        });

		//if(details.type == "xmlhttprequest" && currentUrl == currentActiveUrl ){
		if( 1 == 0 && details.type == "xmlhttprequest"  ){
			if(details.url.indexOf(host) == -1
				&& details.url.indexOf("http://chrome-extension") == -1
				&& details.url.indexOf("https://chrome-extension") == -1
				&& details.url.indexOf("chrome://extensions") ==  -1
			) {
                //  获取ajax请求的参数
				//  还要获取cookie里的kv
                var params = {};

                if(details.method == 'POST' && details.requestBody) {
					if (details.requestBody.formData) {  // form表单的格式
						params = details.requestBody.formData;
					} else if (details.requestBody.raw) { // post请求的数据，raw格式
						var postedString = details.requestBody.raw.map(function(data) { return String.fromCharCode.apply(null, new Uint8Array(data.bytes)) }).join('');
						console.log('postedString',postedString);
						 // 有时JSON.parse这里会报错
						params = JSON.parse(postedString);
					} else {
						console.log('not support post data type',details.requestBody)
					}
                } else {
                    //console.log(parseUrl,details.url);
                    params =  parseUrl(details.url);
                }

                params['ajax_method'] = details.method;
                params['easylog_generatelog_url'] = details.url;
				params['host'] = details.initiator; // 地址栏host,只有域名，没有路径 http://www.bb.com
                params['easylog_initiator'] = currentUrl; //地址栏 http://www.bbb.com/123123/2343242
                //params['location_href'] = window.location.href; // chrome-extension://kpkhgljdoibppbphdelmgcadephnkakn/_generated_background_page.html
				$.ajax({
					type: "post", // 一般用 POST 或 GET 方法
					url: url1, // 要请求的地址
					dataType: "json", // 服务器返回的数据类型，可能是文本 ，音频 视频 script 等浏览 （MIME类型）器会采用不同的方法来解析。
					data:params,
					success:function(msg){
						ajaxRet = msg;
					},
					error:function(e){
						console.log(e)//请求失败是执行这里的函数
					}
				});
			} 
        }
    },

    */
    //{urls:["*://*/*"]},  //监听页面请求,你也可以通过*来匹配。
    //["requestBody"]
//);
