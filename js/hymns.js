var toc = $('#toc');

var navigation = [];

$(document).ready(function () {
	populateNav();
	
});

function populateNav() {
	navigation = toc.find('span.nav');
	(function () {
		for (var i = 0; i < navigation.length; i++) {
			$(navigation[i]).on('click', function() {
				var filter = $(this).text();
				showRecords(filter.replace(/-/g, " "));
			});
		}
	})();
}

function showRecords(filter) {
	var newFilter = filter.split(" ");
	if (newFilter.length > 1) {
		//Display song titles by numbers
	} else {
		//Display song titles by letter
	}
}