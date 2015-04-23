var _ 			= require('lodash')
	, bodyParser = require('body-parser')
	, fixtures 	= require('./fixtures')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy({  
    usernameField: 'id',
    passwordField: 'password'
  },
  function(username, password, done) {
  	var User = _.find(fixtures.users, 'id', username, function(err, user) {
		if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


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