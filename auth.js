var _ 			= require('lodash')
	, passport 	= require('passport')
	, bodyParser = require('body-parser')
	, fixtures 	= require('./fixtures')


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var userAlready = _.find(fixtures.users, 'id', id);

	if (!userAlready) {
		done(null, false)
	}
});

module.exports = passport;