var fadeTime = 500;

var isSortVisible = false;
var isSearchVisible = false;

$(document).ready(function(e) {
	$("#sortMenu").hide();
	$("#searchForm").hide();
	
	$("#sort").click(function(e) {
		// fade out search if it's open
		$("#searchForm").fadeOut(fadeTime, function() { isSearchVisible = false; });
   		$("#sortMenu").fadeIn(fadeTime, function() { isSortVisible = true; });
	});

	$("div[value]").click(function() { // handles sort button clicks
		sortBy = $(this).attr("value");
		generateTiles();
	});
	
	$("#search").click(function() {
		$("#sortMenu").fadeOut(fadeTime, function() { isSortVisible = false; });
		$("#searchForm").fadeIn(fadeTime, function() { isSearchVisible = true; $("#searchField").focus(); });
	});
	$("#searchField").on('input', function() {
		// get matching elements
		var matches = $(".project:contains(" + $(this).val() + ")").show();
		$(".project").not(matches).hide();

	});
});

$(document).click(function(e) {
    var sortMenu = $("#sortMenu");
	var searchBox = $("#searchForm");
	
	if (isSortVisible) {
		if (!sortMenu.is(e.target) && sortMenu.has(e.target).length === 0) sortMenu.fadeOut(fadeTime, function() { isSortVisible = false; });
	}
	else if (isSearchVisible) {
		if (!sortMenu.is(e.target) && searchBox.has(e.target).length === 0) searchBox.fadeOut(fadeTime, function() { isSearchVisible = false; });
	}
});
