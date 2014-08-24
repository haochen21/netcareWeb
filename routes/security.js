var mongoose = require('mongoose');
var async = require('async');
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
                });
        });
};

exports.getUsers = function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) next(err);
        res.status(200).json(user);
    });
};

exports.addUser = function (req, res, next) {
    var user = new User(req.body);
    user.password = req.body.password;
    user.createHashPassword();
    User.findOne({
        loginName: user.loginName
    }, function (err, obj) {
        if (err) next(err);
        if (!obj) {
            user.save(function (err) {
                if (err) next(err);
                res.status(200).json(user);
            });
        } else {
            next(new Error('user is exist'));
        }
    });
};

exports.updateUser = function (req, res, next) {
    var obj = req.body;
    obj.updated = new Date();
    delete obj._id;
    User.findById(req.params.id, function (err, user) {
        if (err) next(err);
        if (obj.password) {
            user.password = obj.password;
            user.createHashPassword();
            obj.hash_password = user.hash_password;
            obj.salt = user.salt;
        }
        User.findByIdAndUpdate(req.params.id, {
            $set: obj
        }, {
            new: true
        }, function (err, updateUser) {
            if (err) next(err);
            if (obj.password) {
                updateUser.password = obj.password;
            }
            res.status(200).json(updateUser);
        });
    });
};

exports.updateUserRoles = function (req, res, next) {
    var roles = req.body;
    async.waterfall([
        function (callback) {
            User.findByIdAndUpdate(req.params.id, {
                $set: {
                    updated: new Date()
                },$set: {
                    roles: roles
                }
            }, {
                new: true
            }, function (err, user) {
                if (err) next(err);
                callback(null, user);
            });
        },
        function (user, callback) {
            Role.update(
                {users: {$in: [user._id]}},
                {$pull: {users: user._id}},
                {multi: true}, function (err, numberAffected, raw) {
                    if (err) next(err);
                    console.log('delete user from role was %d', numberAffected);
                    callback(null, user);
                }
            );
        },
        function (user, callback) {
            if (roles) {
                Role.update(
                    {_id: {$in: roles}},
                    {$addToSet: {users: user._id}},
                    {multi: true}, function (err, numberAffected, raw) {
                        if (err) next(err);
                        console.log('add user to role was %d', numberAffected);
                        callback(null, user);
                    }
                );
            } else {
                callback(null, user);
            }
        }
    ], function (err, result) {
        if (err) next(err);
        res.status(200).json(result);
    });

};

exports.deleteUser = function (req, res, next) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) next(err);
        user.remove();
        res.status(200).json(user);
    });
};

exports.getRoles = function (req, res, next) {
    Role.find()
        .populate('permissions')
        .exec(function (err, roles) {
            res.status(200).json(roles);
        });
};

exports.addRole = function (req, res, next) {
    var role = new Role(req.body);
    Role.findOne({
        name: role.name
    }, function (err, obj) {
        if (err) next(err);
        if (!obj) {
            role.save(function (err) {
                if (err) next(err);
                res.status(200).json(role);
            });
        } else {
            next(new Error('role is exist'));
        }
    });
};

exports.getRole = function (req, res, next) {
    Role.findById(req.params.id, function (err, role) {
        if (err) next(err);
        res.status(200).json(role);
    });
};

exports.updateRole = function (req, res, next) {
    var obj = req.body;
    delete obj._id;
    async.waterfall([
        function (callback) {
            Role.findById(req.params.id, function (err, role) {
                if (err) next(err);
                callback(null, role);
            });
        },
        function (role, callback) {
            Permission.update(
                {roles: {$in: [role._id]}},
                {$pull: {roles: role._id}},
                {multi: true}, function (err, numberAffected, raw) {
                    if (err) next(err);
                    console.log('delete role from permission was %d', numberAffected);
                    callback(null, role);
                }
            );
        },
        function (role, callback) {
            Role.findByIdAndUpdate(role._id, {
                $set: obj
            }, {
                new: true
            }, function (err, role) {
                if (err) next(err);
                callback(null, role);
            });
        },
        function (role, callback) {
            if (obj.permissions) {
                Permission.update(
                    {_id: {$in: obj.permissions}},
                    {$addToSet: {roles: role._id}},
                    {multi: true}, function (err, numberAffected, raw) {
                        if (err) next(err);
                        console.log('add role to permission was %d', numberAffected);
                        callback(null, role);
                    }
                );
            } else {
                callback(null, role);
            }
        }
    ], function (err, result) {
        if (err) next(err);
        res.status(200).json(result);
    });
};

exports.deleteRole = function (req, res, next) {
    Role.findOne({_id: req.params.id}, function (err, role) {
        if (err) next(err);
        role.remove();
        res.status(200).json(role);
    });
};

exports.getPermissions = function (req, res, next) {
    Permission.find()
        .populate('roles')
        .exec(function (err, permissions) {
            res.status(200).json(permissions);
        });
};

exports.addPermission = function (req, res, next) {
    var permission = new Permission(req.body);
    Permission.findOne({
        name: permission.name
    }, function (err, obj) {
        if (err) next(err);
        if (!obj) {
            permission.save(function (err) {
                if (err) next(err);
                res.status(200).json(permission);
            });
        } else {
            next(new Error('permission is exist'));
        }
    });
};

exports.getPermission = function (req, res, next) {
    Permission.findById(req.params.id, function (err, permission) {
        if (err) next(err);
        res.status(200).json(permission);
    });
};

exports.updatePermission = function (req, res, next) {
    var obj = req.body;
    delete obj._id;
    Permission.findByIdAndUpdate(req.params.id, {
        $set: obj
    }, {
        new: true
    }, function (err, permission) {
        if (err) next(err);
        res.status(200).json(permission);
    });
};

exports.deletePermission = function (req, res, next) {
    Permission.findOne({_id: req.params.id}, function (err, permission) {
        if (err) next(err);
        permission.remove();
        res.status(200).json(permission);
    });
};