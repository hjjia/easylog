

var maskHtml = '<div class="mask hide"></div>';
var warnHtml = ' <div class="warn hide"> <div class="title">提示</div> <div class="content">即将推出，敬请期待</div> <div class="i_know">我知道了</div> </div> ';


function addDom(str) {
    $(document.body).append(str);

}

function warn() {
    addDom(maskHtml);
    addDom(warnHtml);
}

function tips() {

}

function layer() {
    addDom(maskHtml);
    addDom(warnHtml);
    $(".warn").removeClass("hide");
    $(".mask").removeClass("hide");
}

function close() {
    $(".warn").addClass("hide");
    $(".mask").addClass("hide");
}

$(document).on('click','.warn .i_know',function(){
    $(".warn").remove();
    $(".mask").remove();
    close();
});