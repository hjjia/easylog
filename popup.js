
  chrome.storage.sync.get('color', function(data) {
    changeColor.style.background= data.color;
    //changeColor.style.backgroundColor = '#3aa757';
    changeColor.setAttribute('value', 12);
  });


// 相当于点击了插件的icon
document.addEventListener('DOMContentLoaded', function () {
    var data = chrome.extension.getBackgroundPage().Data;
    var ajaxdata = chrome.extension.getBackgroundPage().ajaxData;

    $("#result").text(data);
    $("#ajaxresult").text(ajaxdata);
});