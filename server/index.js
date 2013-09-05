// var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
// var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'pc';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

var accounts = db.collection('accounts');
// var mongoose = require('mongoose');

exports.init = function(host, db) {
// 	mongoose.connect('mongodb://'+host+'/'+db);
// 	console.log('mongodb://'+host+'/'+db);
};

// var Schema = mongoose.Schema;

// var accountSchema = new Schema();
// var movieSchema = new Schema();

// var blogSchema = new Schema({
//   title:  String,
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });

// var Blog = mongoose.model('Blog', blogSchema);
// var accounts = mongoose.model('account', accountSchema);
// var movies = mongoose.model('movie', movieSchema);