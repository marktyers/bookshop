
    var restify = require('restify')
    var server = restify.createServer()
    server.use(restify.bodyParser());
    server.use(restify.authorizationParser())
    
    book = require('./routes/books')
    user = require('./routes/users')
    
    server.put('/book/:isbn', book.addBook)
    server.put('/user/:username', user.addUser)
    server.get('/user/:username', user.getUser)

    server.listen(8080)
    console.log('listening on port 8080')
