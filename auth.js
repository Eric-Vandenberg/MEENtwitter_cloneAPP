var _ 			       = require('lodash')
	, bodyParser     = require('body-parser')
	, fixtures 	     = require('./fixtures')
	, passport       = require('passport')
	, LocalStrategy  = require('passport-local').Strategy


passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password'
  },
  function(username, password, done) {
    var user = _.find(fixtures.users,'id', username)
    var pass = _.find(fixtures.users, 'password', password)
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }
    if (!pass) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  }
))

// function verify(username, password, done) {
//   var user = _.find(fixtures.users, 'id', username)

//   if (!user) {
//     return done(null, false, { message: 'Incorrect username.' })
//   }

//   if (user.password !== password) {
//     return done(null, false, { message: 'Incorrect password.' })
//   }

//   done(null, user)
// }

// passport.use(new LocalStrategy(verify))


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