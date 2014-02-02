var http = require('http')
var fs = require('fs')
var sqlite3 = require('sqlite3')
var request = require('request')

// curl -i -H "Accept: application/json" -X PUT -d "genre=7" http://localhost:3000/book/12345

exports.putISBN = function(req, res) {
    var fullURL = req.protocol + "://" + req.get('host') + req.url
    
    var isbn = req.params.isbn
    var genreid = req.body.genre
    try {
        if (typeof(isbn) == 'undefined') throw('Missing ISBN in URI');
        if (typeof(genreid) == 'undefined') throw('Missing genre in request body');
        if (isNaN(isbn)) throw('isbn should be a numerical value')
        if (isNaN(genreid)) throw('genre should be a numerical value')
        isbn = parseInt(isbn)
        genreid = parseInt(genreid)
    } catch(e) {
        res.send({status:'failure', message: e, fullURL: fullURL, genre: genreid})
        res.end()
    }
    url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn
    request(url, function(err, resp, body) {
        try {
            body = JSON.parse(body)
            var items = body.totalItems
            if (items == 0) throw('Invalid ISBN number')
            var book = body.items[0]
            var title = book.volumeInfo.title
            var author = book.volumeInfo.authors[0]
            var description = book.volumeInfo.description
            var year = parseInt(book.volumeInfo.publishedDate)
            var database = new sqlite3.Database("data/bookshop.sqlite")
            var sql = 'INSERT INTO books(isbn, title, author, description, year, genreid) VALUES('+isbn+', "'+title+'", "'+author+'", "'+description+'", '+year+', '+genreid+');';
            database.run(sql, function(err, rows) {
                if (err) {
                    res.send({status:'failure', message: 'Book already exists'})
                    res.end();
                }
                var url = 'http://covers.openlibrary.org/b/isbn/'+isbn+'-L.jpg'
                console.log(url)
                request(url).pipe(fs.createWriteStream('covers/'+isbn+'.jpg'));
                var imgURL = req.protocol + "://" + req.get('host')+'/covers/'+isbn+'.jpg'

                res.send({status:'success', selflink:fullURL, book:{isbn:isbn, title:title, author:author, cover:imgURL, year:year, genreid:genreid}})
            })
        } catch(e) {
            res.send({status:'failure', message: e, selfLink: fullURL, genreid: genreid})
            res.end()
        }
    })
    
    //res.send({status:'success', selfLink:fullURL, isbn:isbn, genre:genre})
    //var database = new sqlite3.Database("data/bookshop.sqlite");
    //var sql = 'SELECT id, title FROM genres;';
    //var genres = []
    //database.all(sql, function(err, rows) {
    //    res.send({status:'success', selfLink:fullURL, genres:rows})
    //    res.end()
    //    database.close()
    //})
}