var name = "options.js";
console.log(name);

/*
$(".js-stage-form" ).submit(function( event ) {
  console.log( $( this ).serializeArray() );
  event.preventDefault();
});
*/
//$('.js-add-stage').on('click',function(){
$(".js-stage-form" ).submit(function( event ) {
	var stage = $(this).serializeArray();
	console.log(stage);
	alert(stage);
});
