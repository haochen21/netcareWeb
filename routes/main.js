var mongoose = require('mongoose');
var request = require("request");
var config = require('../config');
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

exports.loginMongDb = function (req, res, next) {
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

exports.sendSms = function (req, res, next) {
	var loginName = req.body.loginName;
	request.post({
		url: config.netCareServer + '/operators/sms',
		form: {
			loginName: loginName
		}
	}, function (err, response, body) {
		var jsonObject = JSON.parse(body);
		if (err) {
			console.error("send sms error:", err, " (status: " + err.status + ")");
			if (err.status) {
				res.status(err.status).end();
			}
		}
		res.status(200).json(jsonObject);
	});
};

exports.login = function (req, res, next) {
	var loginName = req.body.loginName;
	var password = req.body.password;
	var sms = req.body.sms;
	request.post({
		url: config.netCareServer + '/operators/loginBySms',
		form: {
			loginName: loginName,
			password: password,
			sms:sms
		}
	}, function (err, response, body) {
		var jsonObject = JSON.parse(body);
		if (err) {
			console.error("login error:", err, " (status: " + err.status + ")");
			if (err.status) {
				res.status(err.status).end();
			}
		}
		res.status(200).json(jsonObject);
	});
};