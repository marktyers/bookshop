var mysql = require('mysql')

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'webuser',
        password : 'xxxxxxxx'
});
    
connection.connect();
connection.query('use bookshop');

// http://192.168.1.63/genre/all
// curl -v -# http://192.168.1.63/genre/all | prettyjson
exports.getAll = function(req, res) {
	connection.query('SELECT id, title FROM genres;', function(err, rows, fields) {
  		if (err) {
  			res.statusCode = 400;
  			res.send({status: 'failure', error: {code: 31, text: err}});
  			//throw err;
  		}
		console.log('The genres are: \n', rows);
		var selfLink = 'http://192.168.1.63/genre/all';
		res.statusCode = 200;
		res.send({status: 'success', selfLink: selfLink, genres: rows});
	});
};
// http://192.168.1.63/genre/id/7
// curl -v -# http://192.168.1.63/genre/id/7 | prettyjson
exports.getId = function(req, res) {
	connection.query('SELECT isbn, title, author, CAST(date_format(published, "%Y") AS UNSIGNED) AS published, cover as thumbnail, concat("http://192.168.1.63/book/isbn/",isbn) AS selfLink FROM books WHERE genreid='+req.params.id+';', function(err, rows, fields) {
		if (err) {
  			res.statusCode = 400;
  			res.send({status: 'failure', error: {code: 31, text: err}});
  			//throw err;
  		}
  		console.log('The genres are: \n', rows);
  		var selfLink = 'http://192.168.1.63/genre/id/'+req.params.id;
		res.statusCode = 200;
		res.send({status: 'success', selfLink: selfLink, genres: rows});
	});
    //res.send({id: req.params.id, name: "Book Name", description: "Description"});
};