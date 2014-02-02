var mysql = require('mysql')

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'webuser',
        password : 'xxxxxxxx'
});
    
connection.connect();
connection.query('use bookshop');

exports.getAll = function(req, res) {
	connection.query('SELECT isbn, title FROM books;', function(err, rows, fields) {
  		if (err) throw err;
		console.log('The books are: \n', rows);
		var selfLink = '';
		res.send([{status: 'success', books: rows}]);
	});
};

exports.headISBN = function(req,res) {
	res.close();
}

// http://192.168.1.63/book/isbn/9781449397227
// curl -v -# http://192.168.1.63/book/isbn/9781449397227 | prettyjson
exports.getISBN = function(req, res) {
	var sql = 'SELECT isbn, title, author, CAST(date_format(published, "%Y") AS UNSIGNED) AS published, cover as thumbnail, concat("http://192.168.1.63/book/isbn/",isbn) AS selfLink FROM books WHERE isbn='+req.params.isbn+';';
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) {
  			res.statusCode = 400;
  			res.send({status: 'failure', error: {code: 31, text: err}});
  		}
  		console.log('The book is: \n', rows[0]);
  		var selfLink = 'http://192.168.1.63/book/isbn/'+req.params.isbn;
		res.statusCode = 200;
		res.send({status: 'success', selfLink: selfLink, book: rows[0]});
	});
    //res.send({id: req.params.id, name: "Book Name", description: "Description"});
};
