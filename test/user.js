var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
var assert;
var request = require('request');
var Q = require('q');

var user = require('../model/user.js');

chai.use(chaiAsPromised);
assert = chai.assert;

describe('user', function () {
  describe('new_account', function () {
    afterEach(function (done) {
      done();
    });
		before(function () {
    	// set up the environment
			//var uri = 'http://localhost:5984/bookshop';
			//var deferred = Q.defer();
			//request({method: 'DELETE', uri:uri, function () {
			//	console.log('DB DELETED');
			//	request({method: 'PUT', uri:uri, function () {
			//		console.log('DB ADDED');
			//		deferred.resolve(body);
			//	}); // put
			//}); // delete
		}); //before
			// curl -X DELETE http://127.0.0.1:5984/bookshop
			// curl -X PUT http://localhost:5984/bookshop

    it("status should be 'account added'", function () {
      var params = {name: "John Doe", email: "test@gmail.com", password: "p455w0rd"};
      var response = user.new_account(params);
      var expected = 'account added';
      //the first time, the account should be created successfully.
      return assert.becomes(response, expected);
    });
    it("status should be 'account exists'", function () {
      var params = {name: "John Doe", email: "test@gmail.com", password: "p455w0rd"};
      var response = user.new_account(params);
      var expected = 'account exists';
      console.log('response: '+response);
      console.log('expected: '+expected);
      //If we try to add the account a second time it should fail.
      return assert.isRejected(response, expected);
    });
  });
	describe('check_auth', function () {
		afterEach(function (done) {
      done();
    });
		it("status should be 'credentials correct'", function () {
			// test@gmail.com:p455w0rd
			// Basic dGVzdEBnbWFpbC5jb206cDQ1NXcwcmQ=
			var params = '{"scheme":"Basic","credentials":"dGVzdEBnbWFpbC5jb206cDQ1NXcwcmQ=","basic":{"username":"test@gmail.com","password":"p455w0rd"}}';
			var response = user.check_auth(params);
			console.log('RESPONSE: '+response);
			var expected = 'credentials correct';
			// this account should exist...
			return assert.equal(response, expected);
		});
	});
});
