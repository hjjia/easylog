// todo jk 控制页面滚动， gg 回到顶部， G 去页面底部
// 时间戳 转化为字符串格式
function timetrans(date){
		if(String(date).length < 13) {
	    	var date = new Date(date*1000);//如果date不足13位,需要乘1000
		} else {
	    	var date = new Date(date);//如果date为13位不需要乘1000
		}
	    var Y = date.getFullYear() + '-';
	    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
	    return Y+M+D+h+m+s;
}

var host = "http://www.a.com:5000";
var typeArr = ['unknow','mysql','ssh_server','redis','zookeeper','paas_config','http_request'];
//$(".js-stage-form" ).submit(function( event ) {
$('.js-add-stage').on('click',function(){
	var stage = $('.js-stage-form').serialize();
	$.ajax({
		url:host+"/add-stage",
		data:stage,
		dataType:"json",
		type:"post",
		success:function(res){
		    window.location.reload();
		},
		error:function(err){
			console.log(err);
		}
	});
});


$(document).ready(function(){
	// 步骤列表
    $.ajax({
        url:host+'/stage-list',
        dataType:"json",
        type:"get",
        success:function(res) {
            var str = '<tr> <th>ID </th> <th>Stage_name </th> <th>Connect_str</th> <th>Stage_type </th> <th>Createtime </th> </tr>';
            for(var i= 0; i< res.length; i++) {
                var line = '<tr> <td>'+res[i].id+'</td> <td>'+res[i].stage_name+'</td> <td>'+res[i].connect_str+'</td><td>'+typeArr[res[i].stage_type]+'</td> <td>'+timetrans(res[i].create_time)+'</td> </tr>';
                str = str + line;
            }
            $('.js-stage-list').html(str);
        },
        error:function(err) {
            alert("server is busy");
        }
    });

	// ajax 请求列表
    $.ajax({
        url:host+'/ajax-request-list',
        dataType:"json",
        type:"get",
        success:function(res) {
			var str = "";
			var ajaxList = " <tr> <th>ID </th> <th>url_format</th> <th>ajax_url</th> <th>host</th> <th>Createtime </th>  <th>Operation</th></tr> ";
            for(var i= 0; i< res.length; i++) {
                str = str + '<option value="'+res[i].id+'">'+res[i].url_format+'</option>';
                ajaxList = ajaxList + ' <tr> <td>'+res[i].id+'</td>';
                ajaxList = ajaxList + '<td>'+res[i].url_format+'</td>';
                ajaxList = ajaxList + '<td>'+res[i].ajax_url+'</td>';
                ajaxList = ajaxList + '<td>'+res[i].host+'</td>';
                ajaxList = ajaxList + '<td>'+timetrans(res[i].create_time)+'</td>';
                ajaxList = ajaxList + '<td class="js-edit-ajax" data-id="'+res[i].id+'">edit</td> </tr>';
            }
            $('.js-ajax-url').html(str);
            $('.js-ajax-list').html(ajaxList);
        },
        error:function(err) {
            alert("server is busy");
        }
    });

    // 步骤列表
	$.ajax({
	    url:host+"/stage-list",
	    dataType:"json",
	    type:"get",
	    success: function(res) {
	    	var str = ""
            for(var i= 0; i< res.length; i++) {
                str = str + '<option value="'+res[i].id+'">'+res[i].stage_name+'</option>';
            }
            $('.js-stage-id').html(str);
	    },
	    error: function(err) {
	    }
	});

	$(".js-ajax-url").on('change',function(){
	    var url = $(this).val();
	    $(".js-url-format").val(url);
	});

});

// textare 双击toggle
$(document).on('dblclick','.js-cmd-format',function(){
    var hei = $(this).height();
    if(hei < 100) {
        $(this).height(400);
    }else {
        $(this).height(30);
    }
}
);


// 添加一个步骤
$(document).on('click','.js-add',function(){
    var stageDiv = $(this).parent()[0].outerHTML;
    $(this).parent().after(stageDiv);
    $("form").submit(false);
});

// 删除一个步骤
$(document).on('click','.js-mins',function(){
    if($('.js-all-stage').children().length<=2) {
        alert('至少要有一个步骤');
    } else {
        $(this).parent().remove();
    }
});

// 往上移动
$(document).on('click','.js-up',function(){
    var stageDiv = $(this).parent()[0].outerHTML;
    $(this).parent().prev().before(stageDiv);
    $(this).parent().remove();
})

//往下移动
$(document).on('click','.js-down',function(){
    var stageDiv = $(this).parent()[0].outerHTML;
    $(this).parent().next().after(stageDiv);
    $(this).parent().remove();
});



$(".js-save-relation").on('click',function(){

    var arr = $('.js-all-stage').serializeArray();
    /*
    0: {name: "page_url", value: "1"}
    1: {name: "stage_id", value: "1"}
    2: {name: "stage_cmd_format", value: " 12312321"}
    3: {name: "page_url", value: "1"}
    4: {name: "stage_id", value: "1"}
    5: {name: "stage_cmd_format", value: " 333333"}
    */
    console.log(arr);
    var data = [];
    for(var i=0;i<arr.length; i++) {
        var j = parseInt(i/3);
        if(data[j] == undefined) {
            data[j] = {};
        }
        if(! (arr[i].name in data[j])) {
            data[j][arr[i].name] = arr[i].value;
        }
    }
    data = JSON.stringify(data),
	$.ajax({
		url:host+'/add-stage-ajax-relation',
		dataType:"json",
		contentType: 'application/json',
		type:"post",
		data:data,
		success:function(res) {
			console.log(res);
		    //window.location.reload();
		},
		error:function(err) {
			alert("server is busy");
			console.log(err)
		}
	});

});

$(document).on('click','.js-edit-ajax',function(){
    layer();
});
