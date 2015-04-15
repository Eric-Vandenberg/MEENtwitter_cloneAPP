var http = require('http');
var express = require('express');
var fixtures = require('./fixtures');


var app = express();

app.get('api/tweets', function(req, res){
	var result = [];
	fixtures.tweets.filter(function(tweet){
	 if(tweet.userId == req.query.userId){
	    result.push(tweet);
	 }
	});
	if(result.length > 0) { 
		res.sendStatus(200)
		res.send({tweets: result}); 
	} 
	if(!req.query.userId) {
  	res.sendStatus(400);
	};
	if(!userId) {
  	res.sendStatus(400);
	};
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