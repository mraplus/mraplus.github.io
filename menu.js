$(document).ready(function(e) {
	$("#sortMenu").hide();
	
    $("div[value]").click(function() {
    	sortBy = $(this).attr("value");
    	reload();
    });
	
	$("#sort").click(function(e) {
   		$("#sortMenu").fadeIn(500);
	});
});

