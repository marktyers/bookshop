var mysql = require('mysql')

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'webuser',
        password : 'xxxxxxxx'
});
    
connection.connect();
connection.query('use bookshop');

// http://192.168.1.63/review/id/2
// curl -v -# http://192.168.1.63/review/id/2 | prettyjson
exports.getID = function(req, res) {
	var sql = 'SELECT reviews.id as id, users.name as name,  books.isbn as isbn, books.title as booktitle, books.author as bookauthor, cover, reviews.title as reviewtitle, CAST(date_format(published, "%Y") AS UNSIGNED) AS published, review, rating, date_format(reviews.date, "%Y-%m-%d") AS date, CONCAT("http://192.168.1.63/review/id/",reviews.id) AS selfLink, lat, lon FROM books, reviews, users WHERE reviews.userid = users.id AND reviews.isbn = books.isbn AND reviews.id='+req.params.id+';';
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) {
  			res.statusCode = 400;
  			res.send({status: 'failure', error: {code: 31, text: err}});
  		}
  		try {
  			var user = {name: rows[0].name};
  			var book = {isbn: rows[0].isbn, title: rows[0].booktitle, author: rows[0].bookauthor, published: rows[0].published, cover: rows[0].cover};
  			var review = {title: rows[0].reviewtitle, review: rows[0].review, rating: rows[0].rating, date: rows[0].date, lat: rows[0].lat, lon: rows[0].lon};
  			var selfLink = 'http://192.168.1.63/review/id/'+req.params.id;
			res.statusCode = 200;
			res.send({status: 'success', selfLink: selfLink, user: user, book: book, review: review});
  		} catch (e) {
  			res.statusCode = 400;
  			if (rows == 0) {
  				res.send({status: 'failure', error: {code: 31, text: 'Invalid review id.'}});
  			} else {
  				res.send({status: 'failure', error: {code: 31, text: 'Missing URI parameter.', err: e}});
  			}
  			res.end();
  		}
	});
};

// http://192.168.1.63/review/isbn/9781449397227
// curl -v -# http://192.168.1.63/review/isbn/9781449397227 | prettyjson
exports.getISBN = function(req, res) {
	var sql = 'SELECT reviews.id as id, users.name as name,  books.isbn as isbn, books.title as booktitle, books.author as bookauthor, cover, reviews.title as reviewtitle, CAST(date_format(published, "%Y") AS UNSIGNED) AS published, review, rating, CONCAT("http://192.168.1.63/review/id/",reviews.id) AS selfLink, lat, lon FROM books, reviews, users WHERE reviews.userid = users.id AND reviews.isbn = books.isbn AND books.isbn='+req.params.isbn+';';
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) {
  			res.statusCode = 400;
  			res.send({status: 'failure', error: {code: 31, text: err}});
  		}
  		var book = {isbn: rows[0].isbn, title: rows[0].booktitle, author: rows[0].bookauthor, published: rows[0].published, cover: rows[0].cover};
  		var summary = {review_count: 0, rating_float: 0.0, rating_int: 0};
  		rows.forEach(function(row) {
  			summary['review_count']++;
  			summary['rating_float']+=row['rating'];
  			summary['rating_int']+=row['rating'];
    		delete row['isbn'];
    		delete row['booktitle'];
    		delete row['bookauthor'];
    		delete row['published'];
    		delete row['cover'];
		});
		summary['rating_float'] = parseFloat(summary['rating_float'] / summary['review_count']);
		summary['rating_int'] = parseInt(summary['rating_float']);
  		var selfLink = 'http://192.168.1.63/book/isbn/'+req.params.isbn;
		res.statusCode = 200;
		res.send({status: 'success', selfLink: selfLink, book: book, summary: summary, reviews: rows});
	});
};

//app.get('/review/id/:id', reviews.getID);
//app.get('/review/isbn/:isbn', reviews.getISBN);