$(document).ready(function(e) {
	$("#sortMenu").hide();
	
    $("div[value]").click(function() {
    	sortBy = $(this).attr("value");
    	reload();
    });
});
