

var warnHtml = ' <div class="warn hide"> <div class="title">提示</div> <div class="content">即将推出，敬请期待</div> <div class="i_know">我知道了</div> </div> ';
var tipHtml = ' <div class="warn hide"> <div class="title">提示</div> <div class="content">即将推出，敬请期待</div> <div class="i_know">我知道了</div> </div> ';


function display(type,options) {
	var title = options.title || "提示";
	var content = options.content || "";
	var okCb = options.okCb || function(){};
	var cancelCb = options.cancelCb || function(){};
	var maskHtml = '<div class="mask "></div>';
	var html = ' <div class="warn "> <div class="title">'+title+'</div> <div class="content">'+content+'</div>';
	if(type == "tip") {
	} else if (type == "warn") {
		html += '<div class="i_know">确定</div>'
	} else if (type == "layer") {
		//var btn = '<div class="i_know">我知道了</div> </div> ';
		html += '<div class="i_know">确定</div> <div class="i_cancel">取消</div>  '
	}else{	
	}
	html += '</div> ';
    $(document.body).append(maskHtml);
    $(document.body).append(html);
	$(document).on('click','.i_know',function(){
		okCb();
	});
	$(document).on('click','.i_cancel',function(){
		cancelCb();
	});
}

function hide(){
    $(".warn").addClass("hide");
    $(".mask").addClass("hide");
    $(".warn").remove();
    $(".mask").remove();
}



// 确定 + 取消
function warn() {
    addDom(maskHtml);
    addDom(warnHtml);
}

// alert 提示
function tips(options) {
	var msg = options.msg || "三秒后自动关闭";
	var time = options.time || 3000;
	addDom(maskHtml);
	addDom();
}

// 添加一些表单元素  确定 + 取消
function layer(html='') {
	var content = html+'<input name="safsd" value="123213213"/>';
	display("layer",{
		content:content,	
		okCb:function(){
			console.log("adfasdfasdfa");
		},
		

	});
}

$(document).on('click','.warn .i_know',function(){
	hide();
});
