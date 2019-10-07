// 可以通过jq 获取打开的页面元素,而获取dom元素的方法，可不可以通过ajax从后台获取？
// 在这里(content_script.js)可通过chrome.runtime.sendMessage(json串) 可以把消息发送到background.js中
// background.js可以通过chrome.runtime.chrome.runtime.onMessage.addListener(callback) 去获取content_scirpt.js发送过来的数据
// background.js的数据对象，比如Obj1 可以在 popup.js中 可以通过 var data = chrome.extension.getBackgroundPage().Obj1; 获取
// 在popup.js中，就可以jq直接操作 popup.html中的dom了。

var msg = {
    //"title": $("title").html(),
    "url": window.location.href
};

// 创建EasyLogo
var EasyLog = EasyLog({
	content: '<div>你好 easyTest</div>'
});

// 监听双击事件
//document.addEventListener("dblclick", doubleClick, true);

// 监听释放鼠标按钮事件
document.addEventListener("mouseup", mouseUp, true);

// 双击处理函数
function doubleClick() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if ("" != text) {
        console.log(text);
    }

}

// 释放鼠标处理函数
function mouseUp() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if ("" != text) {
		//layer(text);
		console.log(text);
		EasyLog.createLogo();
		EasyLog.setPanelContent('<div>' + text + '</div>')
    } else {
		EasyLog.hideLogo();
	}
}



// 监听消息
/*

frameId: 0
menuItemId: "menuID"
pageUrl: "https://id.vivo.com.cn/?_201909041631#!/first/aptitude/create"
selectionText: "oi..t"
*/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
		console.log('嘿嘿',request);
		var selectionText = request.selectionText;
		// 如果是输入框,input text area
		if(request.editable) {
			var  inputObj = $("input:focus,textarea:focus,div:focus"); //光标所在元素
			console.log('inputobj',inputObj);
			console.log('inputobj',inputObj[0]);
			//console.log('inputobjval',inputObj[0].val());
			var  res = getResultByMenuId(request.menuItemId, selectionText);
			if(selectionText) {
				//var res = getResultByText(selectionText);
				if(!res) {		// res 为空，则提示暂无该关键词
					alert("尚未配置该关键词，如果需要，请联系管理员");
					return null;
				}
				res = inputObj.val().replace(selectionText,res);	 // 替换一个,应该可以满足需求
			}
			inputObj.val(res);
			inputObj[0].dispatchEvent(new Event('input')) // 修改vue 生成的页面，需要触发一下input事件，不然 这些虚拟的dom不能用。。。
		} else { // 非输入
			res = getBackendInfo(request);
			layer("字符长度："+selectionText.length + " " + selectionText);
		}
	});

/*
chrome.runtime.sendMessage(msg);
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
