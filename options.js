var name = "options.js";
console.log(name);

/*
$(".js-stage-form" ).submit(function( event ) {
  console.log( $( this ).serializeArray() );
  event.preventDefault();
});
*/
var host = "http://www.a.com:5000"
//$(".js-stage-form" ).submit(function( event ) {
$('.js-add-stage').on('click',function(){
	var stage = $('.js-stage-form').serialize();
	console.log(stage);
	$.ajax({
		url:host+"/add-stage",
		data:stage,
		dataType:"json",
		type:"post",
		success:function(res){
			console.log(res);
		},
		error:function(err){
			console.log(err);
		}
	});
});
