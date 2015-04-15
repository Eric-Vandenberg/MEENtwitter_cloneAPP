var _ = require('lodash')
  , express = require('express')
  , fixtures = require('./fixtures')
  , app = express()


app.get('/api/users/:id', function(req, res) {
	if (!req.param.id) {
		return res.sendStatus(404)
	}
	var useR = _.where(fixtures.users, { id : req.param.id })
	res.send({ user: useR })
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