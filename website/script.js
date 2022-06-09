function drawGenres(playlistGenres, playlistImage) {
	let genres = JSON.parse(playlistGenres);
	let unclassified = genres.pop(); // Remove unclassified tracks element.

	// let y = document.createElement("p");
	// y.innerHTML = "genres";
	// y.classList.add("section-title");
	// document.body.appendChild(y);

	let image = document.createElement("img");
	image.src = playlistImage;
	image.src = playlistImage;
	document.body.appendChild(image);

	let xyz = document.createElement("p");

	for (let i = 0; i < genres.length && i < 10; i++) {
		if (genres[i].percentage < 10) {
			xyz.innerHTML += "&nbsp;";
		}

		if (genres[0].percentage == 100 && genres[i].percentage < 100) {
			xyz.innerHTML += "&nbsp;";
		}

		xyz.innerHTML += '<span class="green"><b>' + genres[i].percentage + '</b><span class="percentage">%</span></span>&emsp;-&emsp;<em>' + genres[i].id + "</em></br>";
	}

	document.body.appendChild(xyz);

	let x = document.createElement("p");
	x.innerHTML = "<em>unclassified tracks: <b>" + unclassified.percentage + '</b><span class="percentage">%</span></em>';
	x.style.color = "red";
	document.body.appendChild(x);
}