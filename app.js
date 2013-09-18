console.log('-----------------------------------------------------------------------');
console.log('-----------------------------------------------------------------------');
console.log('--------------- '+Date()+' ---------------');
console.log('-----------------------------------------------------------------------');
console.log('-----------------------------------------------------------------------');

var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var app = express();
var options = { 
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var host = 'https://localhost:';
// var host = 'https://50.112.250.222:';

app.configure(function(){
	app.set('port', 3000);
	app.set('views', __dirname + '/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: '5c65dc10dfdd9eec97e267af4' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(express.static(__dirname + '/public'));
});

require('./server/router')(app);

https.createServer(options,app).listen(app.get('port'), function(){
	console.log("Express server listening on https port " + app.get('port'));
});



// set up plain http server
var mirror = express();
mirror.configure(function(){
	mirror.set('port',8080)
});

http.createServer(mirror).listen(mirror.get('port'), function(){
	console.log("Express server listening on http port " + mirror.get('port'));
});

mirror.get('*',function(req,res){  
    res.redirect(host+app.get('port')+req.path)
});