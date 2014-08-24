var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var async = require('async');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    loginName: {
        type: String,
        required: true,
        trim: true
    },
    hash_password: String,
    salt: String,
    admin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        default: ''
    },
    mobilePhone: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
    })
    .get(function () {
        return this._password;
    });

UserSchema
    .virtual('permissions')
    .set(function (permissions) {
        this._permissions = permissions;
    })
    .get(function () {
        return this._permissions;
    });

UserSchema.methods.createHashPassword = function () {
    this.salt = this.makeSalt();
    this.hash_password = this.encryptPassword(this._password);
};

UserSchema.methods.makeSalt = function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};

UserSchema.methods.authenticate = function (password) {
    return this.encryptPassword(password) === this.hash_password;
};

UserSchema.methods.encryptPassword = function (password) {
    if (!password) return '';
    var encrypred = '';
    try {
        encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
        console.log(err);
    }
    return encrypred;
};

UserSchema.methods.toString = function () {
    var value = this.name + ' ' + this.loginName + ' ' + this._password + ' ' + this.hash_password;
    console.log(value);
};

UserSchema.methods.addRole = function (role, callback) {
    var user = this;
    this.roles.push(role);
    this.save(function (err) {
        if (err)
            console.log(err);
        role.users.push(user);
        role.save(callback);
    });
};

UserSchema.pre('save', function (next) {
    if(this.password){
        this.createHashPassword();
    }
    next();
});

UserSchema.pre('remove', function (next) {
    var user = this;
    async.series([
        function (callback) {
            user.model('Role').update(
                {_id: {$in: user.roles}},
                {$pull: {users: user._id}},
                {multi: true},
                function (err, numberAffected, raw) {
                    if (err) console.log(err);
                    callback(null, 'role');
                }
            );
        }
    ], function (err, results) {
        next();
    });
});

UserSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name: this.name,
        loginName: this.loginName,
        password: this.password,
        salt: this.salt,
        admin: this.admin,
        roles:this.roles,
        permissions: this._permissions
    }
};

var RoleSchema = new Schema({
    name: String,
    description: String,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
});

RoleSchema.pre('remove', function (next) {
    var role = this;
    async.series([
        function (callback) {
            role.model('Permission').update(
                {_id: {$in: role.permissions}},
                {$pull: {roles: role._id}},
                {multi: true},
                function (err, numberAffected, raw) {
                    if (err) console.log(err);
                    callback(null, 'permission');
                }
            );
        },
        function (callback) {
            role.model('User').update(
                {_id: {$in: role.users}},
                {$pull: {roles: role._id}},
                {multi: true},
                function (err, numberAffected, raw) {
                    if (err) console.log(err);
                    callback(null, 'user');
                }
            );
        }
    ], function (err, results) {
        next();
    });
});

RoleSchema.methods.addUser = function (user, callback) {
    var role = this;
    this.users.push(user);
    this.save(function (err) {
        if (err)
            console.log(err);
        user.roles.push(role);
        user.save(callback);
    });
};

RoleSchema.methods.addPermission = function (permission, callback) {
    var role = this;
    this.permissions.push(permission);
    this.save(function (err) {
        if (err)
            console.log(err);
        permission.roles.push(role);
        permission.save(callback);
    });
};

var PermissionSchema = new Schema({
    name: String,
    description: String,
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

PermissionSchema.pre('remove', function (next) {
    this.model('Role').update(
        {_id: {$in: this.roles}},
        {$pull: {permissions: this._id}},
        {multi: true},
        function (err, numberAffected, raw) {
            if (err) console.log(err);
            next();
        }
    );
});

PermissionSchema.methods.addRole = function (role, callback) {
    var permission = this;
    this.roles.push(role);
    this.save(function (err) {
        if (err)
            console.log(err);
        role.permissions.push(permission);
        role.save(callback);
    });
};

mongoose.model('User', UserSchema);
mongoose.model('Role', RoleSchema);
mongoose.model('Permission', PermissionSchema);