var http = require('http');

var setting = {

	host	: 'http://api.brightcove.co.jp',
	path	: '/services/library?command=',
	token	: '&token=PGp28Ek-68-RKEncOt_Sx9VytcOgLjBL40l9ZGZUunIxLbGChWNSwg..',

}

module.exports.getUrl = function(command){
	return setting.host+setting.path+command+setting.token;
}



// var url = exports.getUrl('find_all_videos');
// console.log('url: '+url);

// http.get(url, function(res) {
// 	console.log('STATUS: ' + res.statusCode);
// 	console.log('HEADERS: ' + JSON.stringify(res.headers));

// 	res.on('data', function(d) {
// 		console.log(d);
// 	});

// }).on('error', function(e) {
// 	console.log('ERROR: ' + e.message);
// });
