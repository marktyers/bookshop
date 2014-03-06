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
        for (var i=0; i<keywords.length; i++) keywords[i] = keywords[i].trim().toLowerCase()
    }
    
    var uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+req.params.isbn;
    console.log(uri)
    
    request(uri, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var top = JSON.parse(body)
            //console.log(body)
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
            
            var uri2 = 'http://127.0.0.1:5984/bookshop/'+isbn
            
            var params = {
                method: 'PUT',
                uri:uri2,
                body: JSON.stringify(response)
            }
            
            request(params, function (error, response, body) {
                console.log(body)
                var top = JSON.parse(body)
                if (top.error == 'conflict') {
                    return next(new restify.InvalidContentError("Book '"+title+"' already exists"))
                }
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({code:'success', message:"Book '"+title+"' added"}))
            })
        }
    })
}