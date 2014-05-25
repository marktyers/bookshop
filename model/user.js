var request = require('request');
var md5 = require('MD5');
var crypto = require('crypto');
var Q = require('q');

exports.new_account = function(params) {
  console.log("\nNEW_ACCOUNT")
  params.password = md5(params.password);
  //console.log(params);
  var token = crypto.randomBytes(16).toString('hex');
  var record = {
    type:"user",
    status:"pending",
    token:token,
    credentials:params,
    beacons_of_interest:{
      count:0,
      beacons:[]
    }
  };
  console.log(record);

  var uri = 'http://127.0.0.1:5984/bookshop/'+params.email;
  var deferred = Q.defer();
  request({method: 'PUT', uri:uri, body: JSON.stringify(record)}, function (error, response, body) {
    console.log('performing request')
    var top = JSON.parse(body);
    console.log(top);
    if (top.error == 'conflict') {
      console.log('the supplied email address already exists');
      deferred.reject('account exists');
    } else {
      console.log('resolving request')
      deferred.resolve('account added');
    }
  })
    //var res = {status:"success", message:"Account created"};
    return deferred.promise;
}

exports.req_pw_change = function() {
  return 0;
}

exports.acct_validate = function(params) {
  console.log("\nVALIDATE_ACCOUNT");
  console.log(params);
  var uri = 'http://127.0.0.1:5984/fyndme/'+params.email;
  var deferred = Q.defer();
  request({method: 'GET', uri:uri}, function (error, response, body) {
    console.log('retrieving document');
    var top = JSON.parse(body);
    console.log(top);
    if (top.error == 'not_found') {
      deferred.reject('account does not exist');
    } else {
      var token = top.token;
      var id = top._id;
      console.log('TOKEN: '+token);
      console.log('_ID: '+id);
      if (token == null) {
        deferred.reject('account already validated');
      } else if (token != params.token) {
        deferred.reject('invalid token');
      } else {
        // token is correct, need to delete it...

      }
    }
  }
  return deferred.promise;
}
