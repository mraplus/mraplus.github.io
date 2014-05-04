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
	} else {
		if (a[sortBy]['$t'] > b[sortBy]['$t']) return sortAscending;
		else if (a[sortBy]['$t'] < b[sortBy]['$t']) return -sortAscending;
		return 0;
	}
}

$(document).ready(function () { // makes the project grid
	generateTiles();
});

function generateTiles() { // sorts projects and reprints them
	var projects = [];

	data.sort(sortf);

	$.each(data, function (index, item) {
		var text = "<div class='project " + item['gsx$category']['$t'] + "'>";
		text += "<a href='" + item['gsx$link']['$t'] + "'>" + item['gsx$name']['$t'] + "</a>";
		text += "<p class='description'>" + item['gsx$description']['$t'] + "</p>";
		text += "<p class='author'>By " + item['gsx$author']['$t'] + "</p>";
		text += "</div>";
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
}