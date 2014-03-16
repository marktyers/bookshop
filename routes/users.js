// users.js //
var restify = require('restify')
var request = require('request')
var md5 = require('MD5')

exports.addUser = function(req, res, next) {
    if (req.params.username == undefined) {
        console.log('Missing username in URI')
    }
    if (req.params.name == undefined) {
        console.log('Missing name in request body')
    }
    if (req.params.password == undefined) {
        console.log('Missing password in request body')
    }
    var record = {
        type:"user",
        username:req.params.username,
        name:req.params.name,
        password:md5(req.params.password)
    }
    insertUser(record, res, next)   
}

function insertUser(record, res, next) {
    console.log("\n### INSERT USERNAME ###")
    console.log(record)
    uri = 'http://127.0.0.1:5984/bookshop/'+record.username
    console.log(uri)
    request({method: 'PUT', uri:uri, body: JSON.stringify(record)}, function (error, response, body) {
        console.log(body)
        var top = JSON.parse(body)
        if (top.error == 'conflict') {
            console.log('username already exists')
            return next(new restify.InvalidContentError("Username '"+record.username+"' already exists"))
        }
        res.setHeader('Content-Type', 'application/json')
        delete record.type
        res.end(JSON.stringify({code:'success', message:"Username '"+record.username+"' added", details:record}))
    })
}