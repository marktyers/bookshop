bookshop
========

Simple web service to teach RESTful web service development.
 This has been developed using NodeJS and is aimed at showing how to use this platform.
 
installation
------------
Make sure you have installed nodejs and couchdb (compile from source-latest)

Uses the following packages:

restify
request

Create the bookshop database:
curl -X PUT http://127.0.0.1:5984/bookshop

Adding a new book:

PUT http://192.168.1.63:8080/book/9780596155896
optional keywords field in the request body for csv list.

Use the Google Chrome Postman client.
http://goo.gl/p7nYcZ

booklist.md file contains a couple of ISBNs for testing purposes but also try others including books that don't exist and illegal formats.