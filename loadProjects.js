var sortBy = "name";

var data = [];

function sortf(a,b) {
	if (a[sortBy] > b[sortBy])
		return 1;
	else if (a[sortBy] < b[sortBy])
		return -1;
	return 0;
}

$(document).ready(function() { // makes the project grid
	$.getJSON("projects.json", function(response) { data = response; reload(); });
});

function reload() { // sorts projects and reprints them
	var projects = [];
	
	data = data.sort(sortf);
	
	$.each(data, function(index, item) {
		var text = "<div class='project " + item['category'] + "'>";
		text += "<h1><a href='" + item['link'] + "'>" + item['name'] + "</a></h1>";
		text += "<p class='description'>" + item['description'] + "</p>";
		text += "<p class='author'>By " + item['author'] + "</p>";
		text += "</div>";
		
		projects.push(text);
	});
	
	$("#content").html(projects.join(''));
}
