var EasyLog = function (options) {
    var logoId = 'easy-log-id';
    var panelId = 'easy-log-id';
    var logoDom;
    var panelDom;
    var logoWidth = 50;
    var logoHeight = 50;
    var panelWidth = 200;
    var panelHeight = 100;

    /**
     * 创建logo
     */
    function createLogo() {
        var e = window.event;
        var x = e.clientX;
        var y = e.clientY;
        if (logoDom) {
            logoDom.style.top = y - logoHeight - 20 + 'px';
            logoDom.style.left = x + logoWidth + 20 + 'px';
        } else {
            var logo = document.createElement('div');
            logo.id = logoId;
            logo.style.cssText = 'position: fixed; top: '+ y +'px; left: '+ x +'px;width: '+ logoWidth +'px; height: '+ logoHeight +'px; border: 1px solid #000;';
            document.body.appendChild(logo);
            logoDom = document.getElementById(logoId);
            logoDom.addEventListener('click', function () {
                createPanel();
            }, true); 
        }
    }

    /**
     * 是否显示logo
     * @param {true|false} visible 
     */
    function setLogoVisible(visible) {
        if (!logoDom) {
            return;
        }
        if (visible) {
            logoDom.style.display = 'block';
        } else {
            logoDom.style.display = 'none';
        }
    }

    /**
     * 隐藏logo
     */
    function hideLogo() {
        setLogoVisible(false);
    }

    function createPanel() {
        var e = window.event;
        var x = e.clientX;
        var y = e.clientY;
        var logoLeftPx = logoDom.style.left;
        var logoLeft = +logoLeftPx.substr(0, logoLeftPx.length - 2);
        var logoTopPx = logoDom.style.top;
        var logoTop = +logoTopPx.substr(0, logoTopPx.length - 2);
        var panelLeft = logoLeft + logoWidth + 20;
        var panelTop = logoTop;

        if (panelDom) {
            panelDom.style.top = panelTop + 'px';
            panelDom.style.left = panelLeft + 'px';
        } else {
            panelDom = document.createElement('div');
            panelDom.id = panelId;
            panelDom.style.cssText = 'position: fixed; top: '+ panelTop +'px; left: '+ panelLeft +'px;width: '+ panelWidth +'px; height: '+ panelHeight +'px; border: 1px solid #000;';
            panelDom.innerText = 'HelloWorld!';
            document.body.appendChild(panelDom);
        }
    }

    return {
        createLogo: createLogo,
        hideLogo: hideLogo,
    }
}