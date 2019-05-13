
  let changeColor = document.getElementById('changeColor');

  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.style.backgroundColor = '#3aa757';
    changeColor.setAttribute('value', 12);
  });