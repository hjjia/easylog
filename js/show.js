var EasyLog = function (options) {
    var logoId = 'easy-log-id';
    var panelId = 'easy-log-panel-id';
    var isPanelFixed = false;
    var headerId = 'easy-log-panel-header-id';
    var minimizeId = 'easy-log-minimized-id';
    var maxId = 'easy-log-max-id';
    var fixedId = 'easy-log-fixed-id';
    var closedId = 'easy-log-closed-id';
    var panelContentId = 'easy-log-panel-content-id';
    var logoDom;
    var panelDom;
    var logoWidth = 50;
    var logoHeight = 50;
    var panelWidth = 500;
    var panelHeight = 250;
    var panelHeaderHeight = 30;
    var easylogDrag;
    var isMinimized = false;
    var isMaxed = false;
    var panelCurrentPosition;
    var ETOptions = options;

    /**
     * 创建logo
     */
    function createLogo() {
        var e = window.event;
        e.preventDefault();
        e.stopPropagation();
        var x = e.clientX;
        var y = e.clientY;
        if (logoDom) {
            logoDom.style.top = y - logoHeight - 20 + 'px';
            logoDom.style.left = x + logoWidth + 20 + 'px';
            logoDom.style.display = 'block';
        } else {
            var logo = document.createElement('div');
            logo.id = logoId;
            logo.style.cssText = 'position: fixed; top: '+ y +'px; left: '+ x +'px;width: '+ logoWidth +'px; height: '+ logoHeight +'px;';
            logo.innerHTML = `<span class="iconfont icon-shanzhu-black"> </span>`;
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

    /**
     * 设置固定图标状态
     * @param {*} status 
     */
    function setFixedStatus(status) {
        isPanelFixed = status;
        const fixDom = document.getElementById(fixedId);
        if (isPanelFixed) {
            fixDom.className = 'iconfont icon-fixed icon-fixed-active';
        } else {
            fixDom.className = 'iconfont icon-fixed';
        }
    }

    function createPanel() {
        var e = window.event;
        var x = e.clientX;
        var y = e.clientY;
        var bodyWidth = document.body.clientWidth;
        var bodyHeight = document.body.clientHeight;
        var logoLeftPx = logoDom.style.left;
        var logoLeft = +logoLeftPx.substr(0, logoLeftPx.length - 2);
        var logoTopPx = logoDom.style.top;
        var logoTop = +logoTopPx.substr(0, logoTopPx.length - 2);
        var panelLeft = logoLeft + logoWidth + 20;
        var panelTop = logoTop;

        console.log(panelLeft, panelWidth, bodyWidth, panelWidth + panelLeft);
        if (panelLeft + panelWidth > bodyWidth) {
            panelLeft = bodyWidth - panelWidth;
        }

        if (panelTop + panelHeight > bodyHeight) {
            panelTop = bodyHeight - panelHeight;
        }

        if (panelDom) {
            panelDom.style.top = panelTop + 'px';
            panelDom.style.left = panelLeft + 'px';
            panelDom.style.width = panelWidth + 'px';
            panelDom.style.height = panelHeight + 'px';
            panelDom.style.display = 'block';

            if (easylogDrag) {
                easylogDrag.updatePosition(panelLeft, panelTop);
            }
        } else {
            panelDom = document.createElement('div');
            panelDom.id = panelId;
            panelDom.style.cssText = 'dispaly: block; position: fixed; top: '+ panelTop +'px; left: '+ panelLeft +'px;width: '+ panelWidth +'px; height: '+ panelHeight +'px;background-color: white;padding-top: '+ panelHeaderHeight +'px;';
            panelDom.innerHTML = `<div class="easy-log-header" id="${headerId}" style="position: absolute; top: 0; left: 0; right: 0; height: ${panelHeaderHeight}px; background-color: #eee;display: flex; justify-content: space-between;align-items: center;">
                    <div class="easy-log-header">EsayLog</div>
                    <div>
                        <span id="${minimizeId}" class="iconfont icon-mini"></span>
                        <span id="${maxId}" class="iconfont icon-max"></span>
                        <span id="${fixedId}" class="iconfont icon-fixed"></span>
                        <span id="${closedId}" class="iconfont icon-close"></span>
                    </div>
                </div>
                <div class="easy-log-content" id="${panelContentId}">${ETOptions.content || 'hello World!'}</div>`;
            document.body.appendChild(panelDom);
            panelDom = document.getElementById(panelId);
            
            // 为图标添加事件
            // 最小化
            document.getElementById(minimizeId).addEventListener('click', function () {
                console.log('最小化');
                if (isMinimized) { // 如果当前是最小化，则恢复之前的位置
                    recoverPosition(panelDom, panelCurrentPosition);
                    isMinimized = false;
                } else { // 如果不是最小化， 记录当前位置用来恢复时使用
                    panelCurrentPosition = {
                        left: parseInt(panelDom.style.left),
                        top: parseInt(panelDom.style.top),
                    }
                    minimizeDom(panelDom, panelHeaderHeight);
                    isMinimized = true;
                }
            }, true);

            // 最大化
            document.getElementById(maxId).addEventListener('click', function (e) {
                if (isMaxed) { // 如果是最大化 则恢复之前的位置
                    recoverPosition(panelDom, panelCurrentPosition);
                    isMaxed = false;
                } else {
                    panelCurrentPosition = {
                        left: parseInt(panelDom.style.left),
                        top: parseInt(panelDom.style.top),
                        height: parseInt(getCss(panelDom, 'height')),
                        width: parseInt(getCss(panelDom, 'width')),
                    }
                    maxPanelDom(panelDom);
                    isMaxed = true;
                }
            });
            // 固定
            document.getElementById(fixedId).addEventListener('click', function () {
                setFixedStatus(!isPanelFixed);
            }, true);
            // 关闭
            document.getElementById(closedId).addEventListener('click', function () {
                document.getElementById(panelContentId).innerHTML = '';
                panelDom.style.display = 'none';
                setFixedStatus(false);
            }, true);

            // header添加拖拽事件
            easylogDrag = EasyLogDrag(document.getElementById(headerId), panelDom);
        }

        // 点击页面其他地方时，隐藏面板和小图标
        document.addEventListener('click', function (e) {
            e = e || window.event;

            // e.path记录冒泡路径，...>easylog-panelId -> body.rec -> document -> html -> window
            // 倒数第五个是panel
            // console.log(e.target, 'e.target', e.path.length, e.path, e.path[e.path.length - 5], getCss(panelDom, 'display'));
            const pathLen = e.path.length;
            if ((!e.path[pathLen - 5] || e.path[pathLen - 5].id !== panelId) && getCss(panelDom, 'display') === 'block' && !isPanelFixed ) {
                panelDom.style.display = 'none';
            }

        }, true)
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

    /**
     * 最大化，默认靠右宽一半，高100%
     */
    function maxPanelDom(panelDom) {
        panelDom.style.left = '50%';
        panelDom.style.top = 0;
        panelDom.style.width = '50%';
        panelDom.style.height = '100%';
    }

    /**
     * 从最小化恢复到原来的位置
     * @param {DOM} target 
     * @param {x, y} position 
     */
    function recoverPosition(target, position) {
        target.style.top = position.top + 'px';
        target.style.left = position.left + 'px';

        position.width && (target.style.width = position.width + 'px');
        position.height && (target.style.height = position.height + 'px');
    }

    /**
     * 设置panel InnerHtml
     * @param {*} html 
     */
    function setPanelInnerHtml(html) {
        var panelContentDom = document.getElementById(panelContentId);
        panelContentDom && (panelContentDom.innerHTML = html);
    }

    return {
        createLogo: createLogo,
        hideLogo: hideLogo,
        setPanelContent: setPanelInnerHtml, // 设置面板内容
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