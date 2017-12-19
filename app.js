/**
 * @author Moquo (Moritz Maier)
 */

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

// Start web server
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
