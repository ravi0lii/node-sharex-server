/**
 * @author Moquo (Moritz Maier)
 */

// Constants
const version = require('./package.json').version;
const keys = require('./config.json').keys;

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
// express-fileupload middleware
var fileUpload = require('express-fileupload');
app.use(fileUpload());

// / page
app.get('/', function(req, res) {
    res.send('This server runs <a href="https://github.com/Moquo/node-sharex-upload-server">sharex-upload-server</a> v' + version + ' by <a href="https://moquo.de">Moquo</a>.');
});

// Upload
app.post('/upload', function(req, res) {
    // Check if key is set
    if(!req.body.key) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            success: false,
            error: {
                message: 'Key is empty.',
                fix: 'Submit a key.'
            }
        }));
    } else {
        // Check if key is registered
        var key = req.body.key;
        if(keys.indexOf(key) == -1) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                success: false,
                error: {
                    message: 'Key is invalid.',
                    fix: 'Submit a valid key.'
                }
            }));
        } else {
            // Key is valid
        }
    }
});

// Start web server
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
