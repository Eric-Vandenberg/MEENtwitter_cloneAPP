var _ 			= require('lodash')
	, passport 	= require('passport')
	, bodyParser = require('body-parser')
	, fixtures 	= require('./fixtures')


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var userAlready = _.find(fixtures.users, 'id', id);
	var iD = userAlready.id;
	console.log("this is the id: ", iD);
	if (!userAlready) {
		done(null, false)
	}
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;