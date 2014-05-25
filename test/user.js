var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
var assert;

var user = require('../model/user.js');

chai.use(chaiAsPromised);
assert = chai.assert;

describe('user', function () {
  describe('new_account', function () {
    afterEach(function (done) {
      done();
    });

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
  describe('acct_validate', function() {
    afterEach(function (done) {
      done();
    });
    it('status should be account does not exist', function() {
      var params = {email: "testuser@gmail.com", token: "b960a8a18179bca9775699c816cd9aac"};
      var response = user.acct_validate(params);
      var expected = 'account does not exists';
      return assert.isRejected(response, expected);
    });
    it('status should be invalid token', function() {
      var params = {email: "test@gmail.com", token: "b960a8a18179bca9775699c816cd9aad"};
      var response = user.acct_validate(params);
      var expected = 'invalid token';
      return assert.isRejected(response, expected);
    });
    it('status should be account validated', function() {
      var params = {email: "test@gmail.com", token: "b960a8a18179bca9775699c816cd9aac"};
      var response = user.acct_validate(params);
      var expected = 'account validated';
      return assert.becomes(response, expected);
    });
    it('status should be account already validated', function() {
      var params = {email: "test@gmail.com", token: "b960a8a18179bca9775699c816cd9aac"};
      var response = user.acct_validate(params);
      var expected = 'account already validated';
      return assert.isRejected(response, expected);
    });
  });
});
