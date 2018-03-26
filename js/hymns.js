var $toc = $('#toc'),
	$modal = $('#modal'),
	$modalClose = $modal.find('.close'),
	$modalBody = $('#modalBody');

var navigation = [], songArray = [];

$(document).ready(function () {
	populateNav();
	loadJSON(data);
});

//Hide modal on Esc
$(document).keyup(function(e) {
	if (e.which == 27) $modalClose.click();
});

//Hide modal on click
$modalClose.on("click", function() {
	$modal.removeClass('active').delay(300).fadeToggle();
});

function populateNav() {
	navigation = $toc.find('span');
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
	while ($modalBody[0].firstChild) {
		$modalBody[0].removeChild($modalBody[0].firstChild);
	}
	if (newFilter.length > 1) {
		//Display song titles by numbers
		for (var i = newFilter[0]; i < newFilter[1]; i++) {
			var item = document.createElement('div');
			var number = document.createElement('span');
			number.classList += "num";
			item.appendChild(number);
			item.onclick = function() {showSong(i);} ;
			item.innerText = songArray.songs.song[i].title;
			$modalBody.append(item);
		}
		$modal.toggle().addClass("active");
	} else {
		var length = Object.keys(songArray.songs.song).length;
		var array = [];
		//Display song titles by letter
		for (var i = 0; i < length; i++) {
			if (songArray.songs.song[i].title.charAt(0) === newFilter[0]) {
				array.push([songArray.songs.song[i].title, i]);
			}
		}
		array.sort(function(a,b) {
			return a[0].toUpperCase().localeCompare(b[0].toUpperCase());
		});

		for (var i = 0; i < array.length; i++) {
			var item = document.createElement('div');
			var number = document.createElement('span');
			number.classList += "num";
			item.appendChild(number);
			item.onclick = function() {showSong(i);} ;
			item.innerText = array[i][0];
			$modalBody.append(item);
		}
		$modal.toggle().addClass("active");
	}
}

function showSong(index) {
	//Hide modal and display song
	$modalClose.click();
}

function loadJSON(file) {
	if (localStorage.getItem("songs") === null) {
		localStorage.setItem("songs", JSON.stringify(file));
	}
	songArray = JSON.parse(localStorage.getItem("songs"));
	//console.log(Object.keys(songArray.songs.song[0]).length);
}