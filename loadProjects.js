var sortBy = "name";

var data = [];

function sortf(a,b) {
	if (a[sortBy] > b[sortBy]) return 1;
	else if (a[sortBy] < b[sortBy]) return -1;
	else return 0;
		
}

$(document).ready(function() { // makes the project grid
	$.getJSON("projects.json", function(response) { $(document).data = response; });
	reload();
});

function reload() {
	var projects = [];
	
	data = $(document).data.sort(sortf);
	
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
