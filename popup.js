
/*
  chrome.storage.sync.get('color', function(data) {
    changeColor.style.background= data.color;
    //changeColor.style.backgroundColor = '#3aa757';
    changeColor.setAttribute('value', 12);
  });
  */


console.log("popup");

// 相当于点击了插件的icon
document.addEventListener('DOMContentLoaded', function () {
    var data = chrome.extension.getBackgroundPage().logData;
    var ajaxdata = chrome.extension.getBackgroundPage().ajaxRet;

	console.log('log data',data);
	console.log('ajax data',ajaxdata);
        //data: JSON.stringify(Data),
    $(".result").text(JSON.stringify(data));
    $(".ajaxresult").text(JSON.stringify(ajaxdata));
});
