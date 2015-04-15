var http = require('http');
var express = require('express');
var fixtures = require('./fixtures');


var app = express();

app.get('api/tweets', function(req, res){
	if(!req.query.userId) {
  	 return res.sendStatus(400);
	};
	var result = [];
	fixtures.tweets.filter(function(tweet){
	 if(tweet.userId == req.query.userId){
	    result.push(tweet);
	 }
	});
	var sortedResult = result.sort(function (a, b) {
	  if (a.userId > b.userId) {
	    return 1;
	  }
	  if (a.userId < b.userId) {
	    return -1;
	  }
	  // a must be equal to b
	  return 0;
	});
	if(result.length > 0) { 
		res.sendStatus(200)
		res.send({tweets: sortedResult}); 
	} 
});
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});
 
 
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;
 
var server = app.listen(port, host, function() {
  console.log('Express server listening on http://' + host + ':' + port);
});
 
module.exports = server;