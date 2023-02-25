var http = require('http');
var mockserver = require('mockserver');
require('dotenv').config();

http.createServer(mockserver('mock-server/routes/')).listen(process.env.SERVER_PORT || 5000);