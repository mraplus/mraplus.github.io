$(document).ready(function(e) {
    $("div[value]").click(function() {
    	sortBy = $(this).attr("value");
    	reload();
    });
});
