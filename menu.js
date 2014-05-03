var fadeTime = 500;

$(document).ready(function(e) {
	$("#sortMenu").hide();
	$("#searchForm").hide();
	
	$("#sort").click(function(e) {
   		$("#sortMenu").fadeToggle(fadeTime);
	});
	$("#sort").blur(function(e) {
		$("sortMenu").fadeOut(fadeTime);
	});

	$("#search").click(function() {
		$("#searchForm").fadeToggle(fadeTime, function() { $("#searchField").focus(); });
	});
	$("#search").blur(function() {
		$("#searchForm").fadeOut(fadeTime);
	});
	
	$("div[value]").click(function() { // handles sort button clicks
		sortBy = $(this).attr("value");
		generateTiles();
	});
});
