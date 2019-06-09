var name = "options.js";
console.log(name);

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

/*
$(".js-stage-form" ).submit(function( event ) {
  console.log( $( this ).serializeArray() );
  event.preventDefault();
});
*/
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
			var str = '<tr> <th>ID </th> <th>Host</th> <th>Url</th> <th>Request Url</th> <th>Time </th> </tr>';
            for(var i= 0; i< res.length; i++) {
                var line = '<tr> <td>'+res[i].id+'</td> <td>'+res[i].host+'</td> <td>'+res[i].initiator_url+'</td><td>'+res[i].ajax_url+'</td> <td>'+timetrans(res[i].create_time)+'</td> </tr>';
                str = str + line;
            }
            $('.js-ajax-list').html(str);
        },
        error:function(err) {
            alert("server is busy");
        }
    });
	//do something
});


$(".js-save-relation").on('click',function(){
	var ajaxId = $('.js-ajax-id').val(),
		stageId = $('.js-stage-id').val(),
		cmdFormat = $('.js-cmd-format').val();
// @app.route("/add-stage-ajax-relation",methods=['post'])
	$.ajax({
		url:host+'/add-stage-ajax-relation',
		dataType:"json",
		type:"post",
		data:{"ajax_id":ajaxId,"stage_id":stageId,"cmd_format":cmdFormat},
		success:function(res) {
		    window.location.reload();
		},
		error:function(err) {
			alert("server is busy");
			console.log(err)
		}
	});

});
