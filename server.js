const express = require('express'); 
const spotify = require('./spotify.js');
const bodyParser = require('body-parser');

let playlistName = "";
let playlistGenres = [];

var app = express();
var server = app.listen(3000);

app.use(express.static('website'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', './website');

app.get('/', function (req, res) {
	res.render('index', {
		playlistName,
		playlistGenres
   });
});

app.post('/find-genre', async function (req, res) {
	let link = req.body.link;
	playlistId = link.substring(34, 56);

	spotify.fetchPlaylistInfoAsync(playlistId)
		.then((playlistInfoArray) => {
			//console.table(playlistInfoArray);
			res.render('index', {
				playlistName: playlistInfoArray.name,
                playlistGenres:  JSON.stringify(playlistInfoArray.genres)
		   });
		})
		.catch((err) => console.log(err));
});