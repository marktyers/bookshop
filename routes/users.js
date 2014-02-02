var mysql = require('mysql')

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'webuser',
        password : 'xxxxxxxx'
});
    
connection.connect();
connection.query('use bookshop');

// curl -X PUT -v -# -d "name=John%20Doe&password=p455w0rd" http://192.168.1.63/user/account/jdoe | prettyjson
exports.addAccount = function(req, res) {
	try {
		var username = req.params.username;
		console.log(username);
		if (username == undefined) throw('Missing parameter in URI');
	} catch(e) {
		console.log('missing username');
		res.send({status: 'failure', error: {code: 31, text: e}});
		res.end();
	}
	try {
		var name = req.body.name;
		var password = req.body.password;
		if (name == undefined || password == undefined) throw('Missing parameter in request body');
	} catch(e) {
		console.log('missing request body data');
		res.send({status: 'failure', error: {code: 31, text: e}});
		res.end();
	}
	try {
		var str = username+':'+password;
		console.log(str);
		var buf = new Buffer(str.length);
		var base64 = buf.toString("base64");
		console.log(base64);
		var sql = '';
	} catch(e) {
		
	}
	res.send({username: req.params.username, name: req.body.name, password: req.body.password, base64: base64});
}