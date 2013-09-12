
var express = require('express');
var https = require('https');
var fs = require('fs');
// var models = require('server');

var app = express();
var options = { 
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

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

app.configure('development', function(){
	// models.init('localhost','pc_dev')
	app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});
app.configure('production', function(){
	// models.init('localhost','pc_prod')
	app.use(express.errorHandler());
});
app.configure('test', function(){
	// models.init('localhost','pc_test')
	app.use(express.errorHandler());
});

require('./server/router')(app);

https.createServer(options,app).listen(app.get('port'), function(){
	console.log(Date());
	console.log("Express server listening on https port " + app.get('port'));
	console.log("Express server listening on http port 8080");
})

// set up plain http server
var http = express.createServer();
http.get('*',function(req,res){  
    res.redirect('https://localhost:'+app.get('port')+req.path)
})
http.listen(8080);