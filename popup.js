
  let changeColor = document.getElementById('changeColor');
  changeColor.click(function(){
    alert("asfasd");
    changeColor.style.background= "red";
  });

  chrome.storage.sync.get('color', function(data) {
    changeColor.style.background= data.color;
    //changeColor.style.backgroundColor = '#3aa757';
    changeColor.setAttribute('value', 12);
  });