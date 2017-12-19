/**
 * @author Moquo (Moritz Maier)
 */

// Constants
const config = require('./config.json')
const version = require('./package.json').version;
const keys = config.keys;

// Get the port
const PORT = process.env.SUS_PORT || 3854;

// Logger
var logger = require('./logger.js');
// Random string
var randomString = require('random-string');
// Path
var path = require('path');
// Filesystem
var fs = require('fs');

// Create /uploads directory if not exists
if(!fs.existsSync('./uploads/')) {
    fs.mkdirSync('./uploads/');
    logger.info('Created /uploads directory');
}

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
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    limits: {
        fileSize: config.fileSizeLimit
    }
}));

// / page
app.get('/', function(req, res) {
    res.send('This server runs <a href="https://github.com/Moquo/node-sharex-upload-server">sharex-upload-server</a> v' + version + ' by <a href="https://moquo.de">Moquo</a>.');
});

// Upload
app.post('/upload', function(req, res) {
    // Check if key is set
    if(!req.body.key) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({
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
            logger.auth('Failed authentication with key ' + key);
            res.setHeader('Content-Type', 'application/json');
            res.status(401).send(JSON.stringify({
                success: false,
                error: {
                    message: 'Key is invalid.',
                    fix: 'Submit a valid key.'
                }
            }));
        } else {
            // Key is valid
            logger.auth('Authentication with key ' + key.substr(0, 3) + '... succeeded');
            // Check if file was uploaded
            if(!req.files.file) {
                logger.info('No file was sent, aborting...');
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    success: false,
                    error: {
                        message: 'No file was uploaded.',
                        fix: 'Upload a file.'
                    }
                }));
            } else {
                // File was uploaded
                var file = req.files.file;
                // Generate the path
                var newFileName = randomString({length: config.fileNameLength}) + path.extname(file.name);
                var uploadPath = __dirname + '/uploads/' + newFileName;
                logger.info('Uploading file ' + file.name + ' to ' + newFileName);
                // Move files
                file.mv(uploadPath, function(err) {
                    if(err) {
                        logger.error(err);
                        return res.status(500).send(err);
                    }

                    // Return the informations
                    logger.info('Uploaded file');
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        success: true,
                        file: {
                            url: config.serverUrl + '/f/' + newFileName
                        }
                    }));
                });
            }
        }
    }
});

// Start web server
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
