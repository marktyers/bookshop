var fs = require('fs')
var sqlite3 = require('sqlite3')

exports.getAll = function(req, res) {
    var fullURL = req.protocol + "://" + req.get('host') + req.url
    var database = new sqlite3.Database("data/bookshop.sqlite")
    var sql = 'SELECT id, title FROM genres;';
    var genres = []
    database.all(sql, function(err, rows) {
        res.send({status:'success', selfLink:fullURL, genres:rows})
        res.end()
        database.close()
    })
}

// http://192.168.1.63/genre/7
// curl -v -# http://192.168.1.63/genre/id/7 | prettyjson
exports.getId = function(req, res) {
	res.send({id:req.params.id, name: "Genre Name", description: "Description"})
};