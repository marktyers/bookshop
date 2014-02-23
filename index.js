var express = require('express')

var genres = require('./routes/genres')
var books = require('./routes/books')
 
var app = express();

app.use(express.static(__dirname, '/covers'));

app.use(express.bodyParser());

app.get('/genre/all', genres.getAll)
app.put('/book/:isbn?', books.putISBN)
app.get('/book/:isbn?', books.getISBN)
 
app.listen(3000)
console.log('Listening on port 3000...')