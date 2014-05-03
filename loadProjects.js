var sortby = "name";

function sortf(a,b) {
	if (a[sortby] > b[sortby]) return 1;
	else if (a[sortby] < b[sortby]) return -1;
	else return 0;
		
}

$(document).ready(function() { // makes the project grid
	reload();
});

function reload() {
	$.getJSON("projects.json", function(data) {
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
		
		$("#content").empty();
		$("#content").append(projects.join(''));
	});
}
