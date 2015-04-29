var _             = require('lodash')
  , express       = require('express')
  , session       = require('express-session')
  , bodyParser    = require('body-parser')
  , cookieParser  = require('cookie-parser')
  , shortId       = require('shortid')
  , fixtures      = require('./fixtures')
  , passport      = require('./auth')
  , app           = express()


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.sendStatus(403)
}

// Here come routes definitions.


app.post('/api/auth/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.sendStatus(500); }
    if (!user) { return res.sendStatus(403); }
    req.login(user, function(err) {
      if (err) { return res.sendStatus(500); }
      return res.send({ user : user });
    });
  })(req, res, next);
});


app.post('/api/users', function(req, res) {
  console.log(fixtures.users);
  var user = req.body.user;
  var userAlready = _.find(fixtures.users, 'id', user.id);
  if (userAlready) {
    return res.sendStatus(409);
  }
  user.followingIds = [];
  fixtures.users.push(user);

  res.sendStatus(200);
})

app.post('/api/tweets', ensureAuthentication, function(req, res) {
  var tweet = req.body.tweet;

  tweet.userId = req.user.id;
  // Your route implementation
  var userMatch = _.find(fixtures.tweets, 'userId' , req.user.id)
  // req.user is the authenticated user
  console.log("this is the req.user: ", req.user)
  if (!userMatch) {
    return res.sendStatus(403);
  }
  if (userMatch) {
    var tweet = req.body.tweet;
    tweet.created = Date.now() / 1000 | 0;
    tweet.id = shortId.generate();
    fixtures.tweets.push(tweet);
  }
  res.send({ tweet: tweet})
})


app.get('/api/tweets/:tweetId', function(req, res) {
  var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId)
  console.log(tweet);
  if(!tweet) {
    return res.sendStatus(404)
  }
  res.send({ tweet: tweet })
})


app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
  // Your route implementation
  var userMatch = _.find(fixtures.tweets, 'userId', req.user)
  // req.user is the authenticated user
  if (!userMatch) {
    return res.sendStatus(403);
  }
  var removedTweets = _.remove(fixtures.tweets, 'id', req.params.tweetId)
  if (removedTweets.length == 0) {
    return res.sendStatus(404)
  }

  res.sendStatus(200)
})


app.get('/api/users/:userId', function(req, res) {
  var user = _.find(fixtures.tweets, 'id', req.params.userId)
  if (!user) {
    return res.sendStatus(404)
  }
  res.sendStatus(200)
})


app.get('/api/tweets', function(req, res) {
  if (!req.query.userId) {
    return res.sendStatus(400)
  }

  var tweets = _.where(fixtures.tweets, { userId: req.query.userId })
  var sortedTweets = tweets.sort(function(a, b) { return b.created - a.created })

  res.send({ tweets: sortedTweets })
})


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


module.exports = server;








//My Attempts below all passing:

// var http = require('http');
// var express = require('express');
// var fixtures = require('./fixtures');


// var app = express();


// })


// app.get('/api/tweets', function(req, res){
// 	if(!req.query.userId) {
//   	 return res.sendStatus(400);
// 	};	
// 	var result = [];
	
// 	fixtures.tweets.filter(function(tweet){
// 	 if(tweet.userId == req.query.userId){
// 	    result.push(tweet);
// 	 }
// 	});
//   
//   
//   app.delete('/api/tweets/:tweetId', function(req, res) {
//   var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId)
//   console.log('this is the tweet: ', tweet);
  
//   _.remove(fixtures.tweets, function(tweet) {
//     return tweet.id == req.params.tweetId;
//   })

//   if(!tweet) {
//     return res.sendStatus(404);
//   }

//   res.sendStatus(200)
// })

// 	var sortedResult = result.sort(function (a, b) {
// 		  if (a.created < b.created) {
// 		    return 1;
// 		  }
// 		  if (a.created > b.created) {
// 		    return -1;
// 		  }
// 		  return 0;
// 		});

// 	if(result.length >= 0) { 
// 		res.send({tweets: sortedResult}); 
// 	} 

// });
 
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error();
//   err.status = 404;
//   next(err);
// });
 
 
// var host = process.env.HOST || '127.0.0.1';
// var port = process.env.PORT || 3000;
 
// var server = app.listen(port, host, function() {
//   console.log('Express server listening on http://' + host + ':' + port);
// });
 
// module.exports = server;