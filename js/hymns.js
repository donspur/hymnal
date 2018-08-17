'use strict';

(function() {
	var $toc = $(document.getElementById('toc')),
		$song = $(document.getElementById('song')),
		$back = $(document.getElementById('back')),
		$modal = $(document.getElementById('overlay')),
		$modalClose = $modal.find('.close'),
		$modalBody = $(document.getElementById('modalBody'));

	let navigation = []; 
	let songArray = [];

	populateNav();
	loadJSON(data);

	//Hide modal on Esc
	$(document).keyup(function(e) {
		if (e.which == 27) $modalClose.click();
	});

	$modal.on("click", function() {
		$modal.removeClass('active').delay(300).fadeToggle(200);
	});

	$modalClose.on("click", function() {
		$modal.removeClass('active').delay(300).fadeToggle(200);
	});

	$back.on("click", function() {
		$toc.show();
		$song.hide();
		$back.attr('disabled', '');
	});

	//Add click listeners to spans in contents
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
		if (newFilter[0] === "All") {
			var allFilter = [["1 443"]].join();
			showRecords(allFilter);
		} else if (newFilter.length > 1) {
			//Display song titles by numbers
			for (var i = 0; i < newFilter[1]; i++) {
				var item = document.createElement('div');
				var number = document.createElement('span');
				number.classList += "num";
				number.innerText = i+1;
				item.appendChild(number);
				item.onclick = function(j)	{
					return function() {
						showSong(j);
					}
				}(i);
				item.innerText = songArray.songs.song[i].title;
				$modalBody.append(item);
				item.appendChild(number);
			}
			$modal.toggle().addClass("active");
		} else {
			var length = Object.keys(songArray.songs).length;
			var array = [];
			//Display song titles by letter
			for (var i = 0; i < length; i++) {
				if (songArray.songs[i].title.charAt(0) === newFilter[0]) {
					array.push([songArray.songs[i].title, i]);
				}
			}
			array.sort(function(a,b) {
				return a[0].toUpperCase().localeCompare(b[0].toUpperCase());
			});

		
			for (var i = 0; i < array.length; i++) {
				var item = document.createElement('div');
				var number = document.createElement('span');
				number.classList += "num";
				number.innerText = array[i][1] + 1;
				item.onclick = function(j) {
					return function() {
						showSong(array[j][1]);
					};
				}(i);
				item.innerText = array[i][0];
				$modalBody.append(item);
				item.appendChild(number);
			}
			$modal.toggle().addClass("active");
		}
	}

	function showSong(index) {
		var song = songArray.songs[index];
		var songStruct = [], orderSong = [];
		var number = song.number;
		var title = song.title;
		var verses = song.verse;
		var chorus = song.chorus;
		var author = song.author;

		$song[0].innerHTML = "";
		songStruct.push(number, title, verses, chorus, author);
		
		var ssLength = songStruct.length;
		var header = document.createElement("div");
			header.classList += "songHeader";

		for (var i = 0; i < ssLength; i++) {
			switch (i) {
				case 0:
					if (songStruct[i]) {
						var newDiv = document.createElement("div");
						newDiv.classList += "songNum";
						newDiv.innerText = songStruct[i];
						header.insertAdjacentElement("beforeend", newDiv);
					}
					break;
				case 1:
					if (songStruct[i]) {
						var newDiv = document.createElement("div");
						newDiv.classList += "songTitle";
						newDiv.innerText = songStruct[i];
						header.insertAdjacentElement("afterbegin", newDiv);
						$song.append(header);
					}
					break;
				case 2:
					if (songStruct[i]) {
						var songLength = songStruct[i].length + 1;
						for (var j = 0; j < songLength; j++) {
							var newDiv = document.createElement("div");
							switch (j) {
								case 0: 
									newDiv.classList += "verse";
									newDiv.innerText = cleanupString(songStruct[i][j]);
									$song.append(newDiv);
									break;
								case 1: 
								if (songStruct[3].length > 0) {
										newDiv.classList += "chorus";
										newDiv.innerText = cleanupString(songStruct[3]);
										$song.append(newDiv);
									}
									break;
								default:
									newDiv.classList += "verse";
									newDiv.innerText = cleanupString(songStruct[i][(j-1)]);
									$song.append(newDiv);
									break;
							}
						}
					}
					break;
				case 4:
					if (songStruct[i]) {
						var newDiv = document.createElement("div");
						newDiv.classList += "author";
						newDiv.innerText = songStruct[i];
						$song.append(newDiv);
					}
					break;
			}
		}

		$toc.hide();
		$song.show();
		$back.attr('disabled', false);
		$modalClose.click();

		return false;
	}

	//Remove **, excess space from string
	function cleanupString(string) {
		var newString = string.replace(/\*/g, "").replace(/\s{2,}/g, "\n").trim();
		return newString;
	}

	function isEmpty(str) {
		return (!str || 0 === str.length);
	}

	function loadJSON(file) {
		console.log(file);
		if (localStorage.getItem("songs") === null) {
			console.log("Item Not Found!");
			localStorage.setItem("songs", JSON.stringify(file));
			console.log("Item Set!");
		}
		songArray = JSON.parse(JSON.stringify(file));
		//console.log(Object.keys(songArray.songs.song[0]).length);
	}
})();