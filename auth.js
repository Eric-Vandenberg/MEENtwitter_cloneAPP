var _ 			= require('lodash')
	, passport 	= require('passport')
	, bodyParser = require('body-parser')
	, fixtures 	= require('./fixtures')


passport.serializeUser(function(user, done) {
  done(null, user.id)
})


passport.deserializeUser(function(id, done) {
  var user = _.find(fixtures.users, 'id', id)

  if (!user) {
    return done(null, false)
  }

  done(null, user)
})

module.exports = passport;




// My Attempt Below (passing)

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// })

// passport.deserializeUser(function(id, done) {
// 	var userAlready = _.find(fixtures.users, 'id', id);
// 	if(userAlready) {
// 	done(null, userAlready);
// 	} else {
// 		done(null, false);
// 	}

// })