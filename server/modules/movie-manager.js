var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'pc';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});

var movies = db.collection('movies');

/* record insertion, update & deletion methods */

exports.addNewMovie = function(newData, callback)
{
	movies.findOne({title:newData.title}, function(e, o) {
		if (o){
			callback('title-taken');
		}	else{
					// saltAndHash(newData.pass, function(hash){
						// newData.pass = hash;
					// append date stamp when record was created //
						newData.created_at = moment().format('MMMM Do YYYY, h:mm:ss a');
						movies.insert(newData, {safe: true}, callback);
					// });
		}
	});
}

exports.updateMovie = function(newData, callback)
{
	movies.findOne({_id: getObjectId(newData.id)}, function(e, o){
		o.title 	= newData.title;
		o.detail 	= newData.detail;
		o.genre		= newData.genre;
		o.html 		= newData.html;

		movies.save(o, {safe: true}, function(err) {
			if (err) callback(err);
			else callback(null, o);
		});
	});
}

// exports.updatePassword = function(email, newPass, callback)
// {
// 	movies.findOne({email:email}, function(e, o){
// 		if (e){
// 			callback(e, null);
// 		}	else{
// 			saltAndHash(newPass, function(hash){
// 		        o.pass = hash;
// 		        movies.save(o, {safe: true}, callback);
// 			});
// 		}
// 	});
// }

/* movie lookup methods */

exports.deleteMovie = function(id, callback)
{
	movies.remove({_id: getObjectId(id)}, callback);
}

exports.getMovieById = function(id, callback)
{
	movies.findOne({_id: getObjectId(id)}, function(e, o){ callback(o); });
}

// exports.validateResetLink = function(email, passHash, callback)
// {
// 	movies.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
// 		callback(o ? 'ok' : null);
// 	});
// }

exports.getAllRecords = function(callback)
{
	movies.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	movies.remove({}, callback); // reset movies collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return movies.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	movies.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	movies.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
