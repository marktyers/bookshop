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
  };
  console.log('RECORD: '+JSON.stringify(record));

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

exports.check_auth = function(params) {
	console.log("\nCHECK_AUTH");
	params = JSON.parse(params);
	console.log('USERNAME: '+params.basic.username);
	console.log('PASSWORD: '+md5(params.basic.password));
	var uri = 'http://127.0.0.1:5984/bookshop/'+params.basic.username;
	console.log('URI: '+uri);
	var deferred = Q.defer();
	request({method:'GET', uri:uri}, function(error, response, body) {
		console.log('retrieving record');
		console.log('SUPPLD_PW: '+body.credentials.password);
		console.log('STORED_PW: '+md5(params.basic.password));
		//if () {
			
		//}
		deferred.resolve('SORTED!!');
	})
	//return deferred.promise;
	console.log('BODY: '+JSON.stringify(deferred.promise));
	return 'credentials correct';
}