exports.missingParam = function(req, res) {
	console.log('missingParam');
	res.statusCode = 400;
  	res.send({status: 'failure', error: {code: 31, text: 'Missing parameters in URI.'}});
};