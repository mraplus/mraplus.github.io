var fadeTime = 500;

$(document).ready(function(e) {
	$("#sortMenu").hide();
	
	$("div[value]").click(function() { // handles sort button clicks
		sortBy = $(this).attr("value");
		reload();
	});
	
	$("#sort").click(function(e) {
   		$("#sortMenu").fadeIn(fadeTime);
	});
});

$(document).click(function(e) {
    var box = $("#sortMenu");
	
	if (!box.is(e.target) && box.has(e.target).length === 0) box.fadeOut(fadeTime);
});

