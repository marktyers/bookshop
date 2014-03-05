// books.js //
var request = require('request')
var restify = require('restify')

exports.addBook = function(req, res, next) {
    if (req.params.isbn.length != 13) {
        return next(new restify.InvalidArgumentError("ISBN13 should be a 13 digit number"))
    }
    var isbn = parseInt(req.params.isbn)
    if (isNaN(isbn)) {
        return next(new restify.InvalidArgumentError("ISBN should only contain numeric characters"))
    }
    if (req.params.keywords != undefined) {
        var keywords = req.params.keywords.split(',')
        for (var i=0; i<keywords.length; i++) keywords[i] = keywords[i].trim()
    }
    
    var uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+req.params.isbn;
    console.log(uri)
    
    request(uri, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var top = JSON.parse(body)
            console.log(body)
            if (top.totalItems == 0) {
                return next(new restify.InvalidArgumentError("Invalid ISBN supplied"))
            }
            var kind = top.kind
            var item = top.items[0]
            var book = item.volumeInfo
            var title = book.title
            var author = book.authors[0]
            var publisher = book.publisher.replace(/\"/gi, '')
            var published = book.publishedDate.split('-')
            var description = book.description
            var categories = book.categories
            var response = {
                title:title,
                isbn:isbn,
                keywords:keywords,
                categories:categories,
                author:author,
                publisher:publisher,
                published:parseInt(published[0]),
                description:description
            }
            res.setHeader('Content-Type', 'application/json')
            //res.end(body)
            res.end(JSON.stringify(response))
        }
    })
    
    //var response = {isbn:isbn, genre:genre}
    //res.setHeader('Content-Type', 'application/json')
    //res.end(JSON.stringify(response))
}