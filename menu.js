var fadeTime = 500;

$(document).ready(function(e) {
	$("#sortMenu").hide();
	$("#searchForm").hide();
	
	$("#sort").click(function(e) {
   		$("#sortMenu").fadeToggle(fadeTime);
	});
	$("#sortMenu").blur(function(e) {
		$(this).fadeOut(fadeTime);
	});

	$("#search").click(function() {
		$("#searchForm").fadeToggle(fadeTime, function() { $("#searchField").focus(); });
	});
	$("#searchForm").blur(function() {
		$(this).fadeOut(fadeTime);
	});
	
	$("div[value]").click(function() { // handles sort button clicks
		sortBy = $(this).attr("value");
		generateTiles();
	});
});
