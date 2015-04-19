var _ = require('lodash')
  , express = require('express')
  , bodyParser = require('body-parser')
  , fixtures = require('./fixtures')
  , app = express()


app.use(bodyParser.json());

app.post('/api/users', function(req, res) {
  console.log(fixtures.users);
  var userAlready = _.find(fixtures.users, 'id', req.body.user.id);
  if (userAlready) {
    return res.sendStatus(409);
  }
  req.body.user.followingIds = [];
  fixtures.users.push(req.body.user);

  res.json(req.body.user);
})


app.get('/api/users/:userId', function(req, res) {
  var user = _.find(fixtures.users, 'id', req.params.userId)

  if (!user) {
    return res.sendStatus(404)
  }

  res.send({ user: user })
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