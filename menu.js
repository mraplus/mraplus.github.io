$(document).ready(function (e) {
	$(".popup").hide();
	$(".credits").hide();

	$("#sort").click(function (e) {
		// fade out search if it's open
		$("#searchForm").fadeOut(fadeTime, function () {
			isSearchVisible = false;
		});
		$("#sortMenu").fadeIn(fadeTime, function () {
			isSortVisible = true;
		});
	});

	$("div[value]").click(function () { // handles sort button clicks
		var requestedSort = "gsx$" + $(this).attr("value");
		if (sortBy === requestedSort) sortAscending *= -1; // flip sort direction
		else sortBy = requestedSort;

		generateTiles();
	});

	$("#search").click(function () {
		$("#sortMenu").fadeOut(fadeTime, function () {
			isSortVisible = false;
		});
		$("#searchForm").fadeIn(fadeTime, function () {
			isSearchVisible = true;
			$("#searchField").focus();
		});
	});
	
	$("#searchField").on('input', function () {
		// get matching elements
		var matches = $(".project:contains(" + $(this).val() + ")").show();
		$(".project").not(matches).hide();
	});
	
	$("#credits").click(function() {
        // blur background
		hiddenElements = $("body *").not(".credits").not(".credits *");
		
		hiddenElements.animate( { opacity: 0.5 }, { duration: fadeTime } );
		$(".credits").fadeIn(fadeTime);
    });
	
	$("#closeCredits").click(function(e) {
        $(".credits").fadeOut(fadeTime);
		hiddenElements.animate( { opacity: 1 }, { duration: fadeTime });
    });
});

$(document).click(function (e) {
	var sortMenu = $("#sortMenu");
	var searchBox = $("#searchForm");

	if (isSortVisible) {
		if (!sortMenu.is(e.target) && sortMenu.has(e.target).length === 0) sortMenu.fadeOut(fadeTime, function () {
			isSortVisible = false;
		});
	} else if (isSearchVisible) {
		if (!searchBox.is(e.target) && searchBox.has(e.target).length === 0) searchBox.fadeOut(fadeTime, function () {
			searchBox.val(''); // clear search box
			$(".project").show(); // show all the projects again
			isSearchVisible = false;
		});
	}
});

// trigger search on ctrl-f
$(document).keydown(function (e) {
	if ((e.which == 102 || e.which == 70) && e.ctrlKey) {
		e.preventDefault();
		$("#search").click();
	}
});

// makes search case-insensitive (for the common peasants)
jQuery.expr[':'].Contains = function (a, i, m) {
	return jQuery(a).text().toUpperCase()
		.indexOf(m[3].toUpperCase()) >= 0;
};
