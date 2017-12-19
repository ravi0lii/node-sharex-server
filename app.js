/**
 * @author Moquo (Moritz Maier)
 */

// Constants
const version = require('./package.json').version;

// Get the port
const PORT = process.env.SUS_PORT || 3854;

// Logger
var logger = require('./logger.js');

// Express basic stuff
var express = require('express');
var app = express();
// body-parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// / page
app.get('/', function(req, res) {
    res.send('This server runs <a href="https://github.com/Moquo/node-sharex-upload-server">sharex-upload-server</a> v' + version + ' by <a href="https://moquo.de">Moquo</a>.');
});

// Start web server
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
