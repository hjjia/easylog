var EasyLog = function (options) {
    var logoId = 'easy-log-id';
    var panelId = 'easy-log-panel-id';
    var headerId = 'easy-log-panel-header-id';
    var minimizeId = 'easy-log-minimized-id';
    var fixedId = 'easy-log-fixed-id';
    var closedId = 'easy-log-closed-id';
    var panelContentId = 'easy-log-panel-content-id';
    var logoDom;
    var panelDom;
    var logoWidth = 50;
    var logoHeight = 50;
    var panelWidth = 200;
    var panelHeight = 100;
    var panelHeaderHeight = 30;
    var easylogDrag;

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
            logoDom.style.display = 'block';
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
            panelDom.style.display = 'block';

            if (easylogDrag) {
                easylogDrag.updatePosition(panelLeft, panelTop);
            }
        } else {
            panelDom = document.createElement('div');
            panelDom.id = panelId;
            panelDom.style.cssText = 'position: fixed; top: '+ panelTop +'px; left: '+ panelLeft +'px;width: '+ panelWidth +'px; height: '+ panelHeight +'px; border: 1px solid #000;background-color: white;';
            panelDom.innerHTML = `<div class="easy-log-header" id="${headerId}" style="position: absolute; top: 0; left: 0; right: 0; height: ${panelHeaderHeight}px; background-color: #eee;display: flex; justify-content: space-between;align-items: center;">
                    <div class="easy-log-header">EsayLog</div>
                    <div>
                        <span id="${minimizeId}" style="cursor: pointer;"> - </span>
                        <span id="${fixedId}" style="cursor: pointer;"> 固定 </span>
                        <span id="${closedId}" style="cursor: pointer;"> 关闭 </span>
                    </div>
                </div>
                <div class="easy-log-content" id="${panelContentId}">hello world!</div>`;
            document.body.appendChild(panelDom);
            panelDom = document.getElementById(panelId);
            
            // 为图标添加事件
            document.getElementById(minimizeId).addEventListener('click', function () {
                console.log('最小化');
                minimizeDom(panelDom, panelHeaderHeight);
            }, true);
            document.getElementById(fixedId).addEventListener('click', function () {
                console.log('固定');
            }, true);
            document.getElementById(closedId).addEventListener('click', function () {
                console.log('关闭');
                document.getElementById(panelContentId).innerHTML = '';
                panelDom.style.display = 'none';
            }, true);

            // header添加拖拽事件
            easylogDrag = EasyLogDrag(document.getElementById(headerId), panelDom);
        }
    }

    /**
     * 
     * @param {DOM} target // 最小化的目标DOM
     * @param {*} targetHeight // 最小化的高度
     * @param {*} position 
     */
    function minimizeDom(target, targetHeight, position='right-bottom') {
        var left = 0;
        var top = 0;
        var targetWidthPx = target.style.width;
        var targetWidth = targetWidthPx.substr(0, targetWidthPx.length - 2);
        var pageWidth = document.body.clientWidth;
        var pageHeight = document.body.clientHeight;
        target.style.height = targetHeight;
        switch (position) {
            case 'left-top':
                left = 0;
                top = 0;
            case 'left-bottom':
                left = 0;
                top = pageHeight - targetHeight;
            case 'right-top':
                left = pageWidth - targetWidth;
                top = 0;
            case 'right-bottom':
                left = pageWidth - targetWidth;
                top = pageHeight - targetHeight;
        }
        target.style.left = left + 'px';
        target.style.top = top + 'px';
    }

    return {
        createLogo: createLogo,
        hideLogo: hideLogo,
    }
}

/**
 * 
 * @param {*} bar 触发拖拽的对象 
 * @param {*} target  拖拽的目标
 * @param {*} callback 回调
 */
function EasyLogDrag(bar, target, callback) {
    var params = {
        x: 0,
        y: 0,
        left: 0,
        top:0,
        flag: false,
    };

    var left = getCss(target, 'left');
    var top = getCss(target, 'top');
    if (left !== 'auto') params.left = +left.substr(0, left.length - 2);
    if (top !== 'auto') params.top = +top.substr(0, left.length - 2);

    bar.addEventListener('mousedown', function (e) {
        e = e || window.event;
        this.style.cursor = 'move';
        params.flag = true;
        params.x = e.clientX;
        params.y = e.clientY;
    });

    document.addEventListener('mousemove', function (e) {
        e = e || window.event;
        if (params.flag) {
            e.preventDefault();
            var x = e.clientX;
            var y = e.clientY;
            var diffX = x - params.x;
            var diffY = y - params.y;

            // 计算当前坐标位置
            var currentLeft = params.left + diffX;
            var currentTop = params.top + diffY;

            // 边界判断
            var pageWidth = document.body.clientWidth;
            var pageHeight = document.body.clientHeight;
            var targetWidth = parseInt(getCss(target, 'width'));
            var targetHeight = parseInt(getCss(target, 'height'));
            currentLeft = currentLeft < 0 ? 0 : currentLeft;
            currentLeft = currentLeft + targetWidth > pageWidth ? pageWidth - targetWidth : currentLeft;
            currentTop = currentTop < 0 ? 0 : currentTop;
            currentTop = currentTop + targetHeight > pageHeight ? pageHeight - targetHeight : currentTop;

            // 定位
            target.style.left = currentLeft + 'px';
            target.style.top = currentTop + 'px';
        }
    });

    document.addEventListener('mouseup', function (e) {
        console.log('mouseup')
        params.flag = false;
        bar.style.cursor = 'auto';
        var left = getCss(target, 'left');
        var top = getCss(target, 'top');
        if (left !== 'auto') params.left = +left.substr(0, left.length - 2);
        if (top !== 'auto') params.top = +top.substr(0, left.length - 2);
    });

    // 更新params属性
    function updatePosition(left, top) {
        params.left = left;
        params.top = top;
    }

    return {
        updatePosition: updatePosition,
    }
}

//获取相关CSS属性
function getCss(o,key){
	return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
};