var CT = require('./modules/country-list');
var GL = require('./modules/genre-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var MM = require('./modules/movie-manager');
var VC = require('./modules/vc-api');

var sessionCheck = function( o, route, callback ){ if (o == null) callback(route) }

module.exports = function(app) {

// ------------------------------ main login page ------------------------------ //

	app.get('/', function(req, res){
		if (req.cookies.email == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'ログイン画面'});
		}	else{
			AM.autoLogin(req.cookies.email, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'ログイン画面'});
				}
			});
		}
	});

	app.post('/', function(req, res){
		AM.manualLogin(req.param('email'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('email', o.email, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});


// ------------------------------ logged-in user homepage ------------------------------ //

	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	        res.redirect('/');
	    }   else{
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				user : req.session.user,
				url: 'home'
			});
	    }
	});

	app.post('/home', function(req, res){
		if (req.param('email') != undefined) {
			AM.updateAccount({
				email 		: req.param('email'),
				pass		: req.param('pass')

	// --------------------- other inserting data here --------------------- //

				// email 		: req.param('email'),

			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
					if (req.cookies.email != undefined && req.cookies.pass != undefined){
						res.cookie('email', o.email, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
											}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('email');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});


// ------------------------------ creating new accounts ------------------------------ //

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT , user : req.session.user,
				url: 'signup'
		 });
	});

	app.post('/signup', function(req, res){
		o = {
			email 	: req.param('email'),
			pass	: req.param('pass'),
		};

		AM.accountValidation(o, function(e,m){
			if (e){
				res.send(e, 400);
			}	else{
				EM.accountRequest(o, function(e, m){
						if (!e) {
							res.send('ok', 200);
						}	else{
							res.send('email-server-error', 400);
							for (k in e) console.log('error : ', k, e[k]);
						}
					}
				);
			}
		});
	});


// ------------------------------ registration by admin ------------------------------ //

	app.get('/register', function(req, res) {
		if(req.query["t"]=='token'){

			AM.addNewAccount({
				email   : req.query["e"],
				pass    : req.query["p"],
			}, function(e){
				if (e){
					res.send(e, 400);
				}	else{
					res.send('ok', 200);
				}
			});

		}else{res.send('failed', 400)}
	});


// ------------------------------ password reset ------------------------------ //

	app.post('/lost-password', function(req, res){
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
					if (!e) {
						res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' , user : req.session.user });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
		var email = req.session.reset.email;
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});


// ------------------------------ view & delete accounts ------------------------------ //

	app.get('/accounts', function(req, res) {
		AM.authCheck(req.session.user, function(route){res.redirect(route)});
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'ユーザ一覧', accts : accounts , user : req.session.user });
		});
	});

	app.post('/delete', function(req, res){
		// AM.authCheck(req.session.user, function(route){res.redirect(route)});
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('email');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});

	// app.get('/reset', function(req, res) {
	// 	AM.authCheck(req.session.user, function(route){res.redirect(route)});
	// 	AM.delAllRecords(function(){
	// 		res.redirect('/print');
	// 				});
	// });


// ------------------------------ administrator login page ------------------------------ //

	app.get('/admin', function(req, res){
		if (req.cookies.email == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Administrator' , user : req.session.user });
		}	else{
			AM.autoLogin(req.cookies.email, req.cookies.pass, function(o){
				if (o != null&&o.admin==1){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Administrator' , user : req.session.user });
				}
			});
		}
	});

	app.post('/admin', function(req, res){
		AM.manualLogin(req.param('email'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
				if(o.admin==1){
				    req.session.user = o;
					if (req.param('remember-me') == 'true'){
						res.cookie('email', o.email, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
						res.send(o, 200);
					}
				}else{
					res.send(e,400)
				}
			}
		});
	});


// ------------------------------ movie - new, list, show ------------------------------ //

	app.get('/movies/:id?', function(req, res) {
		sessionCheck(req.session.user,'/', function(route){res.redirect(route)});

			if(req.params.id=='new'){
				AM.authCheck(req.session.user, function(route){res.redirect(route)});

				res.render('movie_new', {  title: 'New Movie', genres: GL , user : req.session.user });

			}else if(req.params.id==undefined){

				MM.getAllRecords(
					function(e, obj){
						res.render('movies', { title : 'Movie List', movies : obj, auth: req.session.user , user : req.session.user });
					}
				)

			}else if(req.params.id.length==24){

				MM.getMovieById(req.params.id, function(movie){
					if(movie==undefined) {
						res.send('movie-not-found', 400);
					}else{
						res.render('movie_show', {  title: 'Show Movie', accts : movie , user : req.session.user });
					}
				})
			}

	});

	app.post('/movies/new', function(req, res){
		AM.authCheck(req.session.user, function(route){res.redirect(route)});
		MM.addNewMovie({
			title 	: req.param('title'),
			detail 	: req.param('detail'),
			genre 	: req.param('genre'),
			html	: req.param('html')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});


// ------------------------------ movie - edit, delete ------------------------------ //

	app.get('/movies/edit/:id', function(req, res){
		AM.authCheck(req.session.user, function(route){res.redirect(route)});
			MM.getMovieById(req.params.id, function(movie){
				res.render('movie_edit', {  title: 'Edit Movie', genres: GL, mdata: movie , user : req.session.user });
			});
	});

	app.post('/movies/edit/:id', function(req, res){
		AM.authCheck(req.session.user, function(route){res.redirect(route)});
		if (req.param('id') == req.params.id) {
			MM.updateMovie({
				id			: req.param('id'),
				title 		: req.param('title'),
				detail 		: req.param('detail'),
				genre 		: req.param('genre'),
				html 		: req.param('html')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					res.send('ok', 200);
				}
			});
		}
	});

	app.get('/movies/delete/:id', function(req, res){
		AM.authCheck(req.session.user, function(route){res.redirect(route)});
		MM.deleteMovie(req.params.id, function(e){
			if (!e){
				res.send('ok', 200);
				res.redirect('/movies');
			}	else{
				res.send('record not found', 400);
			}
	    });
	});


// ------------------------------ - ------------------------------ //

}