var http = require('http');
var data = require('./fixtures');

var server = http.createServer(handleReuest);

function handleReuest(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'})
	res.end('Hello!');
}

server.listen(3000, '127.0.0.1');

module.exports = server;
