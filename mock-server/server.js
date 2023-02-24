var http = require('http');
var mockserver = require('mockserver');

http.createServer(mockserver('mock-server/routes/')).listen(5000);