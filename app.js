var express = require('express');
var reactViews = require('express-react-views');
var bodyParser = require('body-parser');
var _ = require('lodash');
var url = require('url');
var config = require('./config');
var got = require('got');
var request = require('request');
var http = require('http');

var app = express();

app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var initialState = {
		title: "Music",
		home_url: config.site.home
	};
	res.render('Html', { data: initialState });
});

app.get('/api/search', function(req,res,next){
	try {
		if ( !_.isEmpty( req.query.q ) ) {
			got('http://ac.mp3.zing.vn/complete/desktop?type=song&num=5&query=' + encodeURIComponent( req.query.q ))
				.then(function(resp) {
					if (_.isString(resp.body)){
						resp.body = JSON.parse(resp.body);
					}

					if ( resp.statusCode == 200 && resp.body.result && !_.isEmpty( resp.body.data[0].song ) ) {
						var json = [];
						_.forEach(resp.body.data[0].song, function(value, key) {
							json.push({
								name: value.name,
								id: value.id,
								link: url.resolve(config.site.home, 'api/playback/' + value.id),
								image: url.resolve(config.site.home, 'api/image/' + value.id),
							})
						})
						res.status(200).json(json);
					} else {
						res.status(200).json({
							error: true,
							message: 'Không tìm thấy!'
						})
					}
				})
				.catch(function(error) {
					res.status(200).json({
						error: true,
						message: 'Không tìm thấy!'
					})
				})
		} else {
			res.status(200).json({
				error: true,
				message: 'Không tìm thấy!'
			})
		}
	} catch(e) {
		next(e)
	}
})

app.get('/api/song/:id', function(req,res,next) {
	try {
		if (req.params.id) {
			var qty = req.query.qty || '128';
			got('http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata=%7B%22id%22:%22'+ req.params.id +'%22%7D')
				.then(function(resp) {
				resp.body = JSON.parse(resp.body);
				if ( resp.statusCode == 200 && resp.body.song_id ) {
					let data = {
						ID: resp.body.song_id_encode,
						title: resp.body.title,
						source: {},
						download: {},
						thumb: url.resolve(config.site.home, "/api/image/" + resp.body.song_id_encode )
					}

					if ( body.source['128'] ) {
						data.source['128'] = url.resolve(config.site.home, "/api/playback/" + resp.body.song_id_encode + "?p=128" );
					}

					if ( body.source['320'] ) {
						data.source['320'] = url.resolve(config.site.home, "/api/playback/" + resp.body.song_id_encode + "?p=320");
					}

					if ( body.source['lossless'] ) {
						data.source['lossless'] = url.resolve(config.site.home, "/api/playback/" + resp.body.song_id_encode + "?p=lossless");
					}

					if ( body.link_download['128'] ) {
						data.download['128'] = url.resolve(config.site.home, "/api/download/" + resp.body.song_id_encode + "?p=128");
					}

					if ( body.link_download['320'] ) {
						data.download['320'] = url.resolve(config.site.home, "/api/download/" + resp.body.song_id_encode + "?p=320");
					}

					if ( body.link_download['lossless'] ) {
						data.download['lossless'] = url.resolve(config.site.home, "/api/download/" + resp.body.song_id_encode + "?p=lossless");
					}

					res.status(200).json(data);
				} else {
					res.status(200).json({
						error: true,
						message: 'Không tìm thấy!'
					})
				}
			})
			.catch(function(error) {
				res.status(200).json({
					error: true,
					message: 'Không tìm thấy!'
				})
			})
		} else {
			res.status(200).json({
				error: true,
				message: 'Không tìm thấy!'
			})
		}
	} catch(e) {
		next(e);
	}
})

app.get('/api/playback/:id', function(req,res,next) {
	try {
		if (req.params.id) {
			var qty = req.query.p || '128';
			got('http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata=%7B%22id%22:%22'+ req.params.id +'%22%7D')
				.then(function(resp) {
					resp.body = JSON.parse(resp.body);
					console.log(resp);
					if ( resp.statusCode == 200 && !_.isEmpty( resp.body.source ) ) {
						request(resp.body.source[qty]).pipe(res);
					} else {
						res.status(404).send('Not Found');
					}
				})
				.catch(function(err) {
					res.status(404).send('Not Found');
				})
		} else {
			res.status(404).send('Not Found');
		}
	} catch(e) {
		next(e);
	}
})

app.get('/api/download/:id', function(req,res,next) {
	try {
		if (req.params.id) {
			var qty = req.query.p || '128';
			got('http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata=%7B%22id%22:%22'+ req.params.id +'%22%7D')
				.then(function(resp) {
					resp.body = JSON.parse(resp.body);
					if ( resp.statusCode == 200 && !_.isEmpty( resp.body.source ) ) {
						res.attachment( resp.body.title + '.mp3');
						request(resp.body.source[qty]).pipe(res);
					} else {
						res.status(404).send('Not Found');
					}
				})
				.catch(function(err) {
					res.status(404).send('Not Found');
				})
		} else {
			res.status(404).send('Not Found');
		}
	} catch(e) {
		next(e);
	}
})

app.get('/api/image/:id', function(req,res,next){
	try {
		if (req.params.id) {
			got('http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata=%7B%22id%22:%22'+ req.params.id +'%22%7D')
				.then(function(resp) {
					resp.body = JSON.parse(resp.body);
					if ( resp.statusCode == 200 && !_.isEmpty( resp.body.thumbnail ) ) {
						request(url.resolve('http://zmp3-photo-td.zadn.vn/thumb/94_94/', resp.body.thumbnail)).pipe(res);
					} else {
						res.status(404).send('Not Found');
					}
				})
				.catch(function(err) {
					res.status(404).send('Not Found');
				})
		} else {
			res.status(404).send('Not Found');
		}
	} catch(e) {
		next(e);
	}
})

app.get('/api/charts', function(req,res,next) {
	try {
		var id = 'IWZ9Z08I';
		switch (req.query.id) {
			case 'VN':
			default:
				id = 'IWZ9Z08I';
				break;

			case 'EU':
				id = 'IWZ9Z0BW';
				break;

			case 'KR':
				id = 'IWZ9Z0BO';
				break;
		}

		got('http://mp3.zing.vn/json/charts?type=song&id=' + id)
			.then(function(resp) {
				resp.body = JSON.parse(resp.body);
				if ( resp.statusCode === 200 && !_.isEmpty(resp.body.data) && !_.isEmpty(resp.body.data.items) ) {
					var items = resp.body.data.items;
					var data = [];

					_.forEach(items, function(v,k) {
						data.push({
							id: v.id,
							name: v.name,
							thumb: url.resolve(config.site.home, 'api/image/' + v.id ),
							link: url.resolve(config.site.home, 'api/playback/' + v.id),
							singer: v.artists[0].name
						})
					})

					res.json(data);
				} else {
					res.status(200).json({
						error: true,
						message: 'Không tìm thấy!'
					})
				}
			})
			.catch(function(err) {
				res.status(200).json({
					error: true,
					message: 'Không tìm thấy!'
				})
			})
	} catch(e) {
		next(e);
	}
});

process.env.PORT = process.env.PORT || 3000;
http.createServer( app ).listen( process.env.PORT, '0.0.0.0' );
console.log('Server is running.');
