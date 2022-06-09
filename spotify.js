const SpotifyWebApi = require('spotify-web-api-node');
// link.substring(34, 56)

var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function authorize() {
	const authorizationResponse = await spotifyApi.clientCredentialsGrant();
	spotifyApi.setAccessToken(authorizationResponse.body.access_token);
	// console.log(authorizationResponse.body.access_token);
}

async function fetchPlaylistInfoAsync(playlistId) {
	await authorize();
	let playlistData = await spotifyApi.getPlaylist(playlistId);
	let tracksWithArtists = getTrackArtists(playlistData);
	let playlistInfo = {
		name: playlistData.body.name,
		image: playlistData.body.images[0].url,
		genres: await getPlaylistGenresAsync(tracksWithArtists)
	}

	return playlistInfo;
}

function getTrackArtists(playlistData) {
	var tracksWithArtists = [];
	var tracks = playlistData.body.tracks;
	for (var i = 0; i < tracks.items.length; i++) { // Each track
		var trackWithArtists = [];
		var track = tracks.items[i].track
		if (track == null) {
			continue;
		}
		for (var j = 0; j < track.artists.length; j++) { // Each artist in track
			if (track.artists[j].name.length > 0 && track.artists[j].id != null) {
				trackWithArtists.push(track.artists[j].id);
			}
		}
		if (trackWithArtists.length > 0) {
			tracksWithArtists.push(trackWithArtists);
		}
	}
	return tracksWithArtists;
}

async function getPlaylistGenresAsync(tracksWithArtists) {

	var tracksWithGenres = [];

	for (let trackObject of tracksWithArtists) {
		var trackWithGenre = [];

		for (let trackArtistId of trackObject) {
			await spotifyApi.getArtist(trackArtistId)
				.then(function (data) {
					for (var genre of data.body.genres) {
						trackWithGenre.push(genre);
					}
				})
				.catch((err) => console.log(err));
		}

		trackWithDistinctGenres = trackWithGenre.filter(function (item, pos) {
			return trackWithGenre.indexOf(item) == pos;
		});

		tracksWithGenres.push(trackWithDistinctGenres);
	}

	var unclassifiedTracks = 0;
	for (var i = 0; i < tracksWithGenres.length; i++) {
		if (tracksWithGenres[i].length == 0) {
			unclassifiedTracks++;
		}
	}
	var unclassifiedTracksPercentage = Math.round((unclassifiedTracks / tracksWithGenres.length) * 100);

	// Take tracksWithGenres and create an array of genres and amount of times they appear
	var genreCountsObjects = {};
	for (var i = 0; i < tracksWithGenres.length; i++) {
		for (var j = 0; j < tracksWithGenres[i].length; j++) {
			genreCountsObjects[tracksWithGenres[i][j]] = (genreCountsObjects[tracksWithGenres[i][j]] || 0) + 1;
		}
	}

	// Create an array of genre objects
	var genreCountsArray = [];
	for (var genre in genreCountsObjects) {
		genreCountsArray.push({ id: genre, count: genreCountsObjects[genre] });
	}
	genreCountsArray.sort(function (a, b) {
		return b.count - a.count;
	});

	// Take every id in genre and create new array with every id and x which is it's count divided by total tracksWithGenres rows in %.
	var genrePercentageArray = [];
	for (var i = 0; i < genreCountsArray.length; i++) {
		genrePercentageArray.push({ id: genreCountsArray[i].id, percentage: Math.round((genreCountsArray[i].count / tracksWithGenres.length) * 100) });
	}

	// Add unclassified tracks percentage;
	genrePercentageArray.push({ id: "unclassified", percentage: unclassifiedTracksPercentage });


	return genrePercentageArray;
}


// 	for (var i = 0; i < genres.length && i < 10; i++) {
// 		if (genres[i].percentage.toFixed(0) > 0) {
// 			console.log(clc.greenBright(genres[i].percentage.toFixed(0) + '%') + ' \t- ' + genres[i].id);
// 		}
// 	}
// 	if (unclassifiedPercentage > 0) {
// 		console.log(clc.redBright(unclassifiedPercentage.toFixed(0) + '%') + ' \t- unclassified tracks');
// 	}



module.exports.fetchPlaylistInfoAsync = fetchPlaylistInfoAsync;