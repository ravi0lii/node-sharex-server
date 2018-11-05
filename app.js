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
// file-exists
var fileExists = require('file-exists');
// Q promises/deferreds
var Q = require('q');

// Create /uploads directory if not exists
if(config.useLocalStaticServe && !fs.existsSync('./uploads/')) {
    fs.mkdirSync('./uploads/');
    logger.info('Created /uploads directory');
}

// Express basic stuff
var express = require('express');
var app = express();

// Static directory for files
if(config.useLocalStaticServe) {
    app.use('/f', express.static('./uploads'));
}

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
    res.send('This server runs <a href="https://github.com/Moquo/node-sharex-server">node-sharex-server</a> v' + version + ' by <a href="https://moquo.de">Moquo</a>.');
});

// Upload file
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
        var shortKey = key.substr(0, 3) + '...';
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
            logger.auth('Authentication with key ' + shortKey + ' succeeded');
            // Check if file was uploaded
            if(!req.files.file) {
                logger.info('No file was sent, aborting... (' + shortKey + ')');
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

                // Generate a unique path (so it will not conflict with any existing files named the same)
                var getUniqueFilepathDeferred = Q.defer();
                var fileExtension = path.extname(file.name);

                var tryNewRandomString = function() {
                    var newFileName = randomString({length: config.fileNameLength}) + fileExtension;
                    var uploadPath = path.join(config.uploadDirectory, newFileName);

                    fileExists(uploadPath).then(function(doesFileExist) {
                        if(doesFileExist) {
                            tryNewRandomString();
                        } else {
                            getUniqueFilepathDeferred.resolve({ fileName: newFileName, path: uploadPath });
                        }
                    }, function(err) {
                        res.status(500).send(err + ' (' + shortKey + ')');
                    });
                };
                tryNewRandomString();

                getUniqueFilepathDeferred.promise.then(function(payload) {
                    logger.info('Uploading file ' + file.name + ' to ' + payload.path + ' (' + shortKey + ')');

                    // Check file extension (if enabled)
                    if(config.fileExtensionCheck.enabled && config.fileExtensionCheck.extensionsAllowed.indexOf(fileExtension) == -1) {
                        // Invalid file extension
                        logger.info('File ' + file.name + ' has an invalid extension, aborting... (' + shortKey + ')');
                        res.setHeader('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            success: false,
                            error: {
                                message: 'Invalid file extension.',
                                fix: 'Upload a file with a valid extension.'
                            }
                        }));
                    } else {
                        // Move files
                        file.mv(payload.path, function(err) {
                            if(err) {
                                logger.error(err + ' (' + shortKey + ')');
                                return res.status(500).send(err);
                            }
    
                            // Return the informations
                            logger.info('Uploaded file ' + file.name + ' to ' + payload.path + ' (' + shortKey + ')');
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({
                                success: true,
                                file: {
                                    url: config.staticFileServerUrl + payload.fileName,
                                    delete_url: config.serverUrl + '/delete?filename=' + payload.fileName + '&key=' + key
                                }
                            }));
                        });
                    }
                });
            }
        }
    }
});

// Delete file
app.get('/delete', function(req, res) {
    if(!req.query.filename || !req.query.key) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({
            success: false,
            error: {
                message: 'Key and/or file name is empty.',
                fix: 'Submit a key and/or file name.'
            }
        }));
    } else {
        // Check if key is registered
        var key = req.query.key;
        var shortKey = key.substr(0, 3) + '...';
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
            logger.auth('Authentication with key ' + shortKey + ' succeeded');
            // Generate file informations
            var fileName = req.query.filename;
            var filePath = path.join(config.uploadDirectory, fileName);
            logger.info('Trying to delete ' + fileName + ' (' + shortKey + ')');

            // Check if file exists
            fileExists(filePath, function(err, exists) {
                if(err) {
                    logger.error(err + ' (' + shortKey + ')');
                    return res.status(500).send(err);
                }

                if(!exists) {
                    // File doesnt exists
                    logger.info('File ' + fileName + ' doesnt exists, aborting... (' + shortKey + ')');
                    res.setHeader('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        success: false,
                        error: {
                            message: 'The file doesnt exists.',
                            fix: 'Submit a existing file name.'
                        }
                    }));
                } else {
                    // File exists => Delete file
                    fs.unlink(filePath, function(err) {
                        if(err) {
                            logger.error(err + ' (' + shortKey + ')');
                            return res.status(500).send(err);
                        }

                        // Return the informations
                        logger.info('Deleted file ' + fileName + ' (' + shortKey + ')');
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({
                            success: true,
                            message: "Deleted file " + fileName
                        }));
                    });
                }
            });
        }
    }
});

// based on whether or not SSL is enabled, run http or https web server
var server;
if(!config.ssl.useSSL) {
    var http = require('http');
    server = http.createServer(app);
    server.listen(PORT);
} else {
    var https = require('https');
    server = https.createServer({
        key: fs.readFileSync(config.ssl.privateKeyPath, 'utf8'),
        cert: fs.readFileSync(config.ssl.certificatePath, 'utf8')
    }, app);
}

server.listen(PORT);
logger.success('Now listening on port ' + PORT);