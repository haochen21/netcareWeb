var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.checkAdmin = function (request, response, next) {
	if (request.session && request.session.auth && request.session.userId && request.session.admin) {
		//console.info('Access ADMIN: ' + request.session.userId);
		return next();
	} else {
		next('User is not an administrator.');
	}
};

exports.checkUser = function (req, res, next) {
	if (req.session && req.session.auth && req.session.userId && (req.session.user.approved || req.session.admin)) {
		//console.info('Access USER: ' + req.session.userId);
		return next();
	} else {
		next('User is not logged in.');
	}
};

exports.checkApplicant = function (req, res, next) {
	if (req.session && req.session.auth && req.session.userId && (!req.session.user.approved || req.session.admin)) {
		//console.info('Access USER: ' + req.session.userId);
		return next();
	} else {
		next('User is not logged in.');
	}
};

exports.login = function (req, res, next) {
	User.findOne({
			loginName: req.body.loginName
		},
		null, {
			safe: true
		},
		function (err, user) {
			if (err) return next(err);
			if (user) {				
				var auth = user.authenticate(req.body.password);
				if (auth) {
					req.session.auth = true;
					req.session.userId = user._id.toHexString();
					req.session.user = user;
					if (user.admin) {
						req.session.admin = true;
					}
					console.info('Login USER: ' + req.session.userId);
					user.password = req.body.password;
					res.status(200).json({
						type: 'AUTHORIZED',
						user: user
					});
				} else {
					res.status(200).json({
						type: 'PASSWORDERROR',
						msg: 'password error'
					});
				}
			} else {
				res.status(200).json({
					type: 'LOGINNAMEERROR',
					msg: 'user not exist'
				});
			}
		});
};

exports.logout = function (req, res) {
	console.info('Logout USER: ' + req.session.userId);
	req.session.destroy(function (error) {
		if (!error) {
            res.redirect('/');
		}
	});
};