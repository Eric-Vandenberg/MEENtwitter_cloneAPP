var _ = require('lodash')
  , express = require('express')
  , bodyParser = require('body-parser')
  , shortId = require('shortid')
  , passport = require('passport')
  , auth = require('./auth')
  , fixtures = require('./fixtures')
  , app = express()


app.use(bodyParser.json());


app.configure(function() {
  app.use(express.static(__dirname + '/../../public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
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

app.post('/api/tweets', function(req, res) {
  var tweet = req.body.tweet;
  tweet.created = Date.now() / 1000 | 0;
  tweet.id = shortId.generate();
  fixtures.tweets.push(tweet);
  
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


app.delete('/api/tweets/:tweetId', function(req, res) {
  var removedTweets = _.remove(fixtures.tweets, 'id', req.params.tweetId)

  if (removedTweets.length == 0) {
    return res.sendStatus(404)
  }

  res.sendStatus(200)
})


app.get('/api/users/:userId', function(req, res) {
  var user = _.find(fixtures.tweets, 'id', req.params.userId)
  // var match = _.where(fixtures.tweets, { })
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


var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;
 
var server = app.listen(port, host, function() {
  console.log('I\'m listening on Localhost:' + port + '...');
});


module.exports = server








//My Attempts below all passing:

// var http = require('http');
// var express = require('express');
// var fixtures = require('./fixtures');


// var app = express();

// app.get('/api/users/:id', function(req, res) {
//   if (!req.params.id) {
//     return res.sendStatus(400)
//   }
//   var useR = _.find(fixtures.users, 'id', req.params.id)
//   if (!useR) {
//     return res.sendStatus(404)
//   }
//   res.send({ user: useR });

// })
// // var useR = _.find(fixtures.users, 'id', 'billgates')
// // console.log(useR);

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