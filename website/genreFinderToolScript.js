function drawGenres(playlistGenres) {
	let genres = JSON.parse(playlistGenres);
	
	for (let genre of genres) {
		var x = document.createElement("p");
		x.textContent = genre.id + ": " + genre.percentage
		// console.log(genre.id + ": " + genre.percentage);
		document.body.appendChild(x);
	}
  }