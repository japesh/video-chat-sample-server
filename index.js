var express = require('express');
var config = require('./config');
var http = require('http');
var app = express();
require('./routes')(app);
var server = http.createServer(app);
app.listen(config.port, function() {
    console.log('Express server running on port ' + config.port);
});
// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });