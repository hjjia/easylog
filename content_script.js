// 可以通过jq 获取打开的页面元素,而获取dom元素的方法，可不可以通过ajax从后台获取？
// 在这里(content_script.js)可通过chrome.runtime.sendMessage(json串) 可以把消息发送到background.js中
// background.js可以通过chrome.runtime.chrome.runtime.onMessage.addListener(callback) 去获取content_scirpt.js发送过来的数据
// background.js的数据对象，比如Obj1 可以在 popup.js中 可以通过 var data = chrome.extension.getBackgroundPage().Obj1; 获取
// 在popup.js中，就可以jq直接操作 popup.html中的dom了。

var msg = {
    "title": $("title").html(),
    "url": window.location.href
};

chrome.runtime.sendMessage(msg);
/*
var postInfo = $("div.postDesc");
if(postInfo.length!=1){
	chrome.runtime.sendMessage({type:"cnblog-article-information", error:"获取文章信息失败."});
}
else{
	var msg = {
		type: "cnblog-article-information",
		title : $("#cb_post_title_url").text(),
		postDate : postInfo.find("#post-date").text(),
		author : postInfo.find("a").first().text(),
		url: document.URL
	};
	chrome.runtime.sendMessage(msg);
}
*/