// Console colors
var colors = require('colors');

// [INFO] console out
var info = function(message) {
    console.log(colors.cyan('[INFO]'), message);
}

// [ERROR] console out
var error = function(message) {
    console.log(colors.red('[ERROR]'), message);
}

// [SUCCESS] console out
var success = function(message) {
    console.log(colors.green('[SUCCESS]'), message);
}

// Module exports
module.exports.info = info;
module.exports.error = error;
module.exports.success = success;
