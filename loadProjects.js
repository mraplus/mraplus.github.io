function sortf(a, b) {
	if (sortBy === "gsx$category") {
		var Aindex = categoryOrer.indexOf(a[sortBy]['$t']);
		var Bindex = categoryOrder.indexOf(b[sortBy]['$t']);

		if (Aindex > Bindex) return sortAscending;
		else if (Aindex < BAindex) return -sortAscending;
		else { // fall back to name sort
			if (a['gsx$name'] > b['gsx$name']) return sortAscending;
			else return -sortAscending;
		}
	}
	else {
		if (a[sortBy]['$t'] > b[sortBy]['$t']) return sortAscending;
		else if (a[sortBy]['$t'] < b[sortBy]['$t']) return -sortAscending;
		return 0;
	}
}

function generateTiles() { // sorts projects and reprints them
	var projects = [];

	data.sort(sortf);

	$.each(data, function (index, item) {
		var text = "<div class='project " + item['gsx$category']['$t'] + "'><div class='pwrapper'>";
		
		var currentAuthors = item['gsx$author']['$t'].split(/[, ]+and ?| *, */);
		authors = authors.concat(currentAuthors);
		
		var sortedAuthors = "";
		for (var i = 0; i < currentAuthors.length; i++) {
			if (currentAuthors.length === 2) { sortedAuthors = currentAuthors[0] + " and " + currentAuthors[1]; break; }
			if (i === 0) sortedAuthors += currentAuthors[0];
			else if (i < currentAuthors.length - 1) sortedAuthors += ", " + currentAuthors[i];
			else sortedAuthors += ", and " + currentAuthors[i];
		}
		
		if (item['gsx$link']['$t'] === "") text += "<p class='projectTitle noLink'>" + item['gsx$name']['$t'] + "</p>";
		else text += "<a class='projectTitle' href='" + item['gsx$link']['$t'] + "'>" + item['gsx$name']['$t'] + "</a>";
		
		text += "<p class='description'>" + item['gsx$description']['$t'] + "</p>";
		text += "<p class='author'>" + sortedAuthors + "</p>";
		text += "</div></div>";
		
		projects.push(text);
	});
	
	$("#namesData").html(authors.sort().join("<br>"));
	
	$(".loading").hide();
	$("#content").append(projects.join(''));
	
	$(".project").hover(function (e) { // darken inactive <div>s
		$(".project").not(this).stop().animate({
			opacity: fadeValue
		});
	}, function (e) {
		$(".project").not(this).stop().animate({
			opacity: '1'
		});
	});
	
	$(".project:last-child").css( { 'margin-bottom': height });

}
