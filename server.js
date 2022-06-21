const express = require('express');
const spotify = require('./spotify.js');

var app = express();

app.listen(process.env.PORT || 3000);
app.use(express.static('website'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', './website');

app.get('/', function (req, res) {
	res.render('index', {});
});

app.get('/playlist-genre', function (req, res) {
	let playlistLink = req.query.link;
	let playlistId = playlistLink.trim().substring(34, 56);

	spotify.fetchPlaylistInfoAsync(playlistId)
		.then((playlistInfoArray) => {
			let playlistGenresWithoutApostrophe = JSON.stringify(playlistInfoArray.genres).replace(/'/g, '`');

			res.render('genre', {
				playlistName: playlistInfoArray.name,
				playlistImageUrl: playlistInfoArray.image,
				playlistGenres: playlistGenresWithoutApostrophe
			});
		})
		.catch(() => res.render('index', {}));
});