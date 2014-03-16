// books.js //
// documentation using naturaldocs.org //
var request = require('request')
var restify = require('restify')
var merge = require('merge')
var md5 = require('MD5')

/*
    Function: getBook
    Retrieved book details from the Google Books API
    passes the results to the insertBook function.
        Parameters:
            isbn     - the ISBN of the book to be added (this is the CouchDB key)
            keywords - an object containing the data to be inserted (JSON)
            res      - the response object used to send data to the client
            next     - ???
    See Also:
        <insertBook>
 */
function getBook(isbn, keywords, res, next) {
    console.log("\n### GET BOOK ###")
    console.log('ISBN: '+isbn)
    console.log('KEYWORDS: '+keywords)
    var uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn;
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
            var publisher = book.publisher
            if (publisher != undefined) publisher = book.publisher.replace(/\"/gi, '')
            var published = book.publishedDate.split('-')
            var description = book.description
            var categories = book.categories
            var record = {
                type:"book",
                title:title,
                isbn:isbn,
                keywords:keywords,
                categories:categories,
                author:author,
                publisher:publisher,
                published:parseInt(published[0]),
                description:description
            }
            if (record.publisher == undefined) delete record.publisher
            if (record.keywords == null) delete record.keywords
            console.log(record)
            // pass the record data to the insertBook function to add it to the database
            insertBook(isbn, record, res, next)
        }
    }) // end request
}

/*
    Function: insertBook
    inserts a book into the CouchDB database against the ISBN key.
    Parameters:
        isbn   - the ISBN of the book to be added (this is the CouchDB key)
        record - an object containing the data to be inserted (JSON)
        res    - the response object used to send data to the client
        next   - ???
    See Also:
        <getBook>
 */
function insertBook(isbn, record, res, next) {
    console.log("\n### INSERT BOOK ###")
    console.log('ISBN: '+isbn)
    //console.log(record)
    uri = 'http://127.0.0.1:5984/bookshop/'+isbn
    request({method: 'PUT', uri:uri, body: JSON.stringify(record)}, function (error, response, body) {
        var top = JSON.parse(body)
        if (top.error == 'conflict') {
            updateBook(isbn, record, res, next)
            //return next(new restify.InvalidContentError("Book '"+record.title+"' already exists"))
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({code:'success', message:"Book '"+record.title+"' added", details:record}))
    })
}

function updateBook(isbn, record, res, next) {
    console.log("\n### UPDATE BOOK ###")
    console.log('ISBN: '+isbn)
    //console.log(record)
    uri = 'http://127.0.0.1:5984/bookshop/'+isbn

    request({method: 'GET', uri:uri}, function (error, response, body) {
        //console.log(body)
        //var results = merge(record, body)
        //console.log(results)
        var top = JSON.parse(body)
        var newRecord = {_id:top._id, _rev:top._rev}
        newRecord = merge(record, newRecord)
        console.log(newRecord)
        uri = 'http://127.0.0.1:5984/bookshop/'+isbn
        request({method: 'PUT', uri:uri, body: JSON.stringify(newRecord)}, function (error, response, body) {
            var top = JSON.parse(body)
            if (top.error == 'conflict') {
                updateBook(isbn, record, res, next)
                return next(new restify.InvalidContentError("Book '"+record.title+"' already exists STILL"))
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({code:'success', message:"Book '"+record.title+"' updated"}))
        })
    })
}

function checkAuth(req, res, next) {
    console.log("\n### AUTHENTICATING USER ###")
    var authData = req.authorization
    console.log(authData)
    if (authData.scheme != 'Basic') {
        return next(new restify.InvalidCredentialsError("No authorization header found (Requires HTTP Basic)"))
    }
    if (authData.basic.username == undefined || authData.basic.password == undefined) {
        return next(new restify.InvalidCredentialsError("Invalid authorization header (Requires HTTP Basic)"))
    }
    uri = 'http://127.0.0.1:5984/bookshop/'+authData.basic.username
    console.log(uri)
    request({method: 'GET', uri:uri}, function (error, response, body) {
        console.log(body)
        var top = JSON.parse(body)
        console.log(top.error)
        if (top.error == 'not_found') { // username does not exist in the database
            console.log('INVALID CREDENTIALS')
            return next(new restify.InvalidCredentialsError("Invalid username or password"))
        }
        if (top.password != md5(authData.basic.password)) {
            return next(new restify.InvalidCredentialsError("Invalid username or password"))
        }
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
        } else {
            var keywords = null
        }
        getBook(isbn, keywords, res, next)
    })
}

exports.addBook = function(req, res, next) {
    checkAuth(req, res, next)
}