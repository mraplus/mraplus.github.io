function sortf(a, b) {
	if (sortBy === "gsx$category") {
		var Aindex = categoryOrer.indexOf(a[sortBy]['$t']);
		var Bindex = categoryOrder.indexOf(b[sortBy]['$t']);

		if (Aindex > Bindex) return sortAscending;
		else if (Bindex > Aindex) return -sortAscending;
		
		else {
			if (a['gsx$name'] > b['gsx$name']) return sortAscending;
			else return -sortAscending;
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
		
		var authors = item['gsx$author']['$t'].split(/[, ]+and ?|, /).filter(function(elem) { return elem !== "" }).sort(); // sometimes regex gives empty results
		var sortedAuthors = "";
		for (var i = 0; i < authors.length; i++) {
			if (authors.length === 2) { sortedAuthors = authors[0] + " and " + authors[1]; break; }
			if (i === 0) sortedAuthors += authors[0];
			else if (i < authors.length - 1) sortedAuthors += ", " + authors[i];
			else sortedAuthors += ", and " + authors[i];
		}
		
		if (item['gsx$link']['$t'] === "") text += "<p class='projectTitle noLink'>" + item['gsx$name']['$t'] + "</p>";
		else text += "<a class='projectTitle' href='" + item['gsx$link']['$t'] + "'>" + item['gsx$name']['$t'] + "</a>";
		
		text += "<p class='description'>" + item['gsx$description']['$t'] + "</p>";
		text += "<p class='author'>" + sortedAuthors + "</p>";
		text += "</div></div>";
		
		projects.push(text);
	});
	$("#content").html(projects.join(''));
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
