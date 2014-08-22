var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

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

UserSchema.methods.createHashPassword = function(){
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
    var encrypred;
    try {
        encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        return encrypred;
    } catch (err) {
        return '';
    }
};

UserSchema.methods.toString = function () {
    var value = this.name + ' ' + this.loginName + ' ' + this._password + ' ' + this.hash_password;
    console.log(value);
};

UserSchema.methods.addRole = function (role, callback) {
    this.roles.push(role);
    this.save(callback);
};

UserSchema.methods.toJSON = function () {
    return {
        id: this.id,
        name: this.name,
        loginName: this.loginName,
        password: this.password,
        salt: this.salt,
        admin: this.admin,
        permissions: this._permissions
    }
};

var RoleSchema = new Schema({
    name: String,
    description: String,
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
});

RoleSchema.methods.addPermission = function (permission, callback) {
    var role = this;
    this.permissions.push(permission);
    this.save(function (err) {
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

PermissionSchema.methods.addRole = function (role, callback) {
    var permission = this;
    this.roles.push(role);
    this.save(function (err) {
        console.log(err);
        role.permissions.push(permission);
        role.save(callback);
    });
};

mongoose.model('User', UserSchema);
mongoose.model('Role', RoleSchema);
mongoose.model('Permission', PermissionSchema);