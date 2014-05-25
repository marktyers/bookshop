bookshop v2.0
=============

Temp line....




Simple web service to teach RESTful web service development.
 This has been developed using NodeJS and is aimed at showing how to use this platform.
 
Documentation
-------------
Draft documentation can be found at:
https://docs.google.com/document/d/14hPXA3ao9VDDwPdIe3oQrJntjEUtQepnghlzOzgTTnc/edit
 
installation
------------
Make sure you have installed nodejs and couchdb (compile from source-latest)

Uses the following packages:

restify
request
q
chai
chai-as-promised
async
merge
MD5

To install all the required modules:
	$npm install

Create the bookshop database:
	curl -X PUT http://127.0.0.1:5984/bookshop

Adding a new book:

PUT http://192.168.1.63:8080/book/9780596155896
optional keywords field in the request body for csv list.

Use the Google Chrome Postman client.
http://goo.gl/p7nYcZ

booklist.md file contains a couple of ISBNs for testing purposes but also try others including books that don't exist and illegal formats.
