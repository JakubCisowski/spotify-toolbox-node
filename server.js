const express = require('express');
const spotify = require('./spotify.js');

let playlistId = "";
let playlistLink = "";

var app = express();

app.listen(3000);
app.use(express.static('website'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', './website');

app.get('/', function (req, res) {
	res.render('index', {});
});

app.get('/playlist-genre', function (req, res) {
	playlistLink = req.query.link;
	playlistId = playlistLink.trim().substring(34, 56);

	spotify.fetchPlaylistInfoAsync(playlistId)
		.then((playlistInfoArray) => {
			res.render('genre', {
				playlistName: playlistInfoArray.name,
				playlistImageUrl: playlistInfoArray.image,
				playlistLink: playlistLink,
				playlistGenres: JSON.stringify(playlistInfoArray.genres)
			});
		})
		.catch(() => res.render('index', {}));
});