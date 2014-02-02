var express = require('express')

var genres = require('./routes/genres');
var books = require('./routes/books');
var reviews = require('./routes/reviews');
var users = require('./routes/users');
var errors = require('./routes/errors');
 
var app = express();
app.use(express.bodyParser());

app.get('/genre/all', genres.getAll);
app.get('/genre/id/:id', genres.getId);

app.get('/', books.getAll);
app.get('/book/isbn/:isbn', books.getISBN);
app.head('/book/isbn/:isbn', books.headISBN);

//app.get('/review/isbn', errors.missingParam);
//app.get('/review/id', errors.missingParam);
app.get('/review/isbn/:isbn?', reviews.getISBN);
app.get('/review/id/:id?', reviews.getID);

app.put('/user/account/:username?', users.addAccount);
 
app.listen(80);
console.log('Listening on port 80...');