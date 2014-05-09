$(document).ready(function (e) {
	$(".popup").hide();
	$(".credits").hide();
	$("#fade").hide();

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
		var text = $(this).val();
		if (text.toLowerCase() === "do work") {
			$("<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; padding: 40px; background-color: black; opacity: 0.5; color: white; font-size: 150px; font-weight: bold; text-align: center'>SON!</div>").appendTo("body").fadeOut(fadeTime, function() { $(this).remove(); });
		}
		
		var matches = $(".project:search(" + text + ")").show();
		$(".project").not(matches).hide();
	});
	
	$("#credits").click(function() {
        // blur background	
		
		$("#fade").show().animate( { opacity: 0.5 }, { duration: fadeTime } );
		
		$(".credits").fadeIn(fadeTime);
    });
	
	$("#closeCredits, #fade").click(function(e) {
        $(".credits").fadeOut(fadeTime);
		$("#fade").animate( { opacity: 0 }, fadeTime, function() { $("#fade").hide(); } );
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

jQuery.expr[':'].search = function (a, i, m) {
	return jQuery(a).text().toUpperCase()
		.indexOf(m[3].toUpperCase()) >= 0;
};
