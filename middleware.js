const response = require('./response.js');
const logger = require('./logger.js');

const config = require('./config.json');
const keys = config.keys;

module.exports.keyRequired = function (req, res, next) {
    var key = null;

    if (req.body.key) {
        key = req.body.key;
    } else if (req.query.key) {
        key = req.query.key;
    } else {
        response.emptyKey(res);
        return;
    }

    // Check if key is registered
    var key = req.body.key;
	var key2 = req.query.key;
    if (keys.indexOf(key) == -1 && keys.indexOf(key2) == -1 ) {
        logger.auth('Failed authentication with key ' + key +' and '+key2);
        response.invalidKey(res);
        return;
    }

    // Add short key ot request locals
	if (typeof key !== 'undefined'){
		req.locals = {
			shortKey: key.substr(0, 3) + '...'
		};
	}else if(typeof key2 !== 'undefined'){
		req.locals = {
			shortKey: key2.substr(0, 3) + '...'
		};
	}

    logger.auth('Authentication with key ' + req.locals.shortKey + ' succeeded');

    next();
}