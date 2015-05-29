var LISTSTYLE,LISTSCRIPT = [];
var DOMAIN_NAME = "";
function searchItem(array,item){
	for(var i=0;i<array.length;i++){
		if(array[i] === item){
			return i;
		}
	}
	return -1;
}
function resetStyle(){
	$("style,link").remove();
}
function loadView(url){
	$.ajax({
		//load web service
	})
}
function loadStyle(fileName){
	if(searchItem(LISTSTYLE,fileName) === -1){
		$("head").append('<link rel="stylesheet" href="'+filename+'" type="text/css" />');
	}
}
function loadScript(fileName){
	if(searchItem(LISTSCRIPT,fileName) === -1){
		$.getScript( "ajax/test.js",function( data, textStatus, jqxhr ) {
			  console.log( data ); // Data returned
			  console.log( textStatus ); // Success
			  console.log( jqxhr.status ); // 200
			  console.log( "Load was performed." );
			})
		  .done(function( script, textStatus ) {
			console.log( textStatus );
		  })
		  .fail(function( jqxhr, settings, exception ) {
			$( "div.log" ).text( "Triggered ajaxError handler." );
		});
	}}
function loadImage(fileName,target){
	$(target).load();
}
(function(e){
	var requestUrl = window.location;
	loadView(requestUrl);
})(jQuery)