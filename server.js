
    var restify = require('restify')
    var server = restify.createServer()
    server.use(restify.bodyParser());
    server.use(restify.authorizationParser())
    
    book = require('./routes/books')
    user = require('./routes/users')
    
    server.put('/book/:isbn', book.addBook)
    server.put('/user/:username', user.addUser)

    server.post('/book/:isbn', function(req, res) {
        var auth = req.authorization
        console.log(auth)
        var user = req.authorization.username
        var passwd = req.authorization.password
        var isbn = parseInt(req.params.isbn)
        var genre = parseInt(req.params.genre)
        var response = {authorization:auth, isbn:isbn, genre:genre}
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(response.headers))
    })

    server.listen(8080)
    console.log('listening on port 8080')
