module.exports = {
	site: {
		home: function() {
			return process.env.NODE_ENV == 'production' ? 'http://music.dungps.com' : 'http://localhost:3000'
		}
	}
}