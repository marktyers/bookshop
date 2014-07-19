var Q = require('q');

exports.addBook = function(req, res, next) {
    checkAuth(req, res, next)
}
