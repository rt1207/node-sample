
var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
	ssl		    : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	var link = 'http://localhost/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}

EM.accountRequest = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : 'ryo.t.12@icloud.com', // this is administrator
		subject      : '[PC MOVIE] ユーザー申請',
		text         : 'text',
		attachment   : EM.composeRequest(account)
	}, callback );
}

EM.composeRequest = function(o)
{
	var link = 'http://localhost:8080/register?e='+o.email+'&p='+o.pass+'&n='+o.name+'&u='+o.user+'&c='+o.country+'&t=token';
	var html = "<html><body>";
		html += "管理者様<br><br>";
		html += "ユーザー申請がありました。<br><br>";
		html += "ご確認の上<br><br>";
		html += "<a href='"+link+"'>リンクをクリックしてユーザ登録</a><br><br>";
		html += "<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}
