 chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.baidu.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });



// https://blog.csdn.net/hhmouse111/article/details/36901527
// https://www.cnblogs.com/guogangj/p/3235703.html
//https://www.moesif.com/blog/technical/apirequest/How-We-Captured-AJAX-Requests-with-a-Chrome-Extension/
//chrome.webRequest.onBeforeRequest.addListener (
chrome.webRequest.onCompleted.addListener (
 
    function(details) {
    
        chrome.tabs.query({active:true},function(tab){
            // 当前页面的url
            var pageUrl = tab[0].url;
            // 在这可以写判断逻辑，将请求cancel掉，或者将请求打印出来
            console.log("current url ==> " + pageUrl);
            console.log("current tab -> " + tab);
        });
 
    },
     
    {urls:["*://*/*"]},  //监听页面请求,你也可以通过*来匹配。
    ["blocking"] 
);

