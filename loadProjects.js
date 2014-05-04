function sortf(a, b) {
   if (a[sortBy] > b[sortBy]) return sortAscending;
   else if (a[sortBy] < b[sortBy]) return -sortAscending;
   return 0;
}

$(document).ready(function() { // makes the project grid
   $.getJSON("projects.json", function(response) {
      data = response;
      searchData = data;
      generateTiles();
   });
});

function generateTiles() { // sorts projects and reprints them
   var projects = [];
   
   $.each(data, function(index, item) {
      var text = "<div class='project " + item['gsx$category']['$t'] + "'>";
      text += "<h1><a href='" + item['gsx$link']['$t'] + "'>" + item['gsx$name']['$t'] + "</a></h1>";
      text += "<p class='description'>" + item['gsx$description']['$t'] + "</p>";
      text += "<p class='author'>By " + item['gsx$author']['$t'] + "</p>";
      text += "</div>";
      projects.push(text);
   });
   $("#content").html(projects.join(''));
   $("div.project").hover(function(e) { // darken inactive <div>s
      $("div.project").not(this).stop().animate({
         opacity: fadeValue
      });
   }, function(e) {
      $("div.project").not(this).stop().animate({
         opacity: '1'
      });
   });
}
