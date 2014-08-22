var mongoose = require('mongoose');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Permission = mongoose.model('Permission');

exports.getUser = function (req, res, next) {
	User.findById(req.params.id, function (err, user) {
		if (err) next(err);
		res.status(200).json(user);
	});
};

exports.getUserPermissions = function (req, res, next) {
	User.findById(req.params.id)
		.populate('roles')
		.exec(function (err, user) {
			var roleIds = [];
			var permissions = [];
			for (var i = 0; i < user.roles.length; i++) {
				roleIds.push(user.roles[i].id);
			}
			Role.find({
				'_id': {
					$in: roleIds
				}
			})
				.populate('permissions')
				.exec(function (err, roles) {
					if (err) next(err);
					for (var i = 0; i < roles.length; i++) {
						if (roles[i].permissions) {
							var role = roles[i];
							for (var j = 0; j < roles[i].permissions.length; j++) {
								permissions.push(role.permissions[j]);
							}
						}
					}
					res.status(200).json(permissions);
				})
		})
}


exports.addUser = function (req, res, next) {
	var user = new User(req.body);
	User.findOne({
		loginName: user.loginName
	}, function (err, obj) {
		if (err) next(err);
		if (!obj) {
			user.save(function (err) {
				if (err) next(err);
				user.password = req.body.plainPassword;
				res.status(200).json(user);
			});
		} else {
			next(new Error('user is existed'));
		}
	});

};

exports.updateUser = function (req, res, next) {
	var obj = req.body;
	obj.updated = new Date();
	delete obj._id;
	if (obj.plainPassword) {
		User.findById(req.params.id, function (err, user) {
			if (err) next(err);
			user.plainPassword = obj.plainPassword;
			obj.password = user.password;
			obj.salt = user.salt;
			User.findByIdAndUpdate(req.params.id, {
				$set: obj
			}, {
				new: true
			}, function (err, updateUser) {
				if (err) next(err);
				updateUser.password = obj.plainPassword;
				res.status(200).json(updateUser);
			});
		});
	} else {
		User.findByIdAndUpdate(req.params.id, {
			$set: obj
		}, {
			new: true
		}, function (err, user) {
			if (err) next(err);
			res.status(200).json(user);
		});
	}

};

exports.deleteUser = function (req, res, next) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) next(err);
		res.status(200).json(user);
	});
};