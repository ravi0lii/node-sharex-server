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

// Start web server
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
