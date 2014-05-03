var fadeTime = 500;

$(document).ready(function(e) {
	$("#sortMenu").hide();
	
	$("div[value]").click(function() { // handles sort button clicks
		sortBy = $(this).attr("value");
		reload();
	});
	
	$("#sort").click(function(e) {
		$("#sortMenu").fadeToggle(fadeTime);
	});
});
