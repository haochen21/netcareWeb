var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var config = require('./app/config');

var mongodbConnect = function () {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect(config['Mongodb'].url, options);
};
mongodbConnect();

// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err);
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var Permission = mongoose.model('Permission');

var permission1 = new Permission({
    name: 'BUTTON_CIRCUIT_EDIT',
    description: '电路维护权限'
});

var permission2 = new Permission({
    name: 'BUTTON_OPERATOR_EDIT',
    description: '用户维护权限'
});

var permission3 = new Permission({
    name: 'BUTTON_ALARM_EDIT',
    description: '告警处理权限'
});

var permission4 = new Permission({
    name: 'BUTTON_CUSTOMER_EDIT',
    description: '客户维护权限'
});

var permission5 = new Permission({
    name: 'SYNC_CUSTOMER',
    description: '全量同步客户权限'
});

var Role = mongoose.model('Role');

var role1 = new Role({
    name: '管理员权限',
    description: '管理员权限'
});

var role2 = new Role({
    name: '资料维护',
    description: '资料维护'
});

var role3 = new Role({
    name: '告警管理',
    description: '告警管理'
});

var role4 = new Role({
    name: '客户维护',
    description: '客户维护'
});

var role5 = new Role({
    name: '全量同步客户',
    description: '全量同步客户'
});


var User = mongoose.model('User');
var user = new User({
    name: '管理员',
    loginName: 'admin',
    password: 'abcd1234',
    admin: true,
    mobilePhone: '13817475681'
});

async.series([
        function (callback) {
            Role.remove(function (err, p) {
                if (err)
                    console.log(err);
                callback(null,'');
            });
        },
        function (callback) {
            Permission.remove(function (err, p) {
                if (err)
                    console.log(err);
                callback(null,'');
            });
        },
        function (callback) {
            User.remove(function (err, p) {
                if (err)
                    console.log(err);
                callback(null,'');
            });
        },
        function (callback) {
            permission1.save(function (err, permission) {
                if (err) next(err);
                console.log('permission:' + permission.id + ',' + permission.name);
                callback(null,'');
            });
        },
        function (callback) {
            permission2.save(function (err, permission) {
                if (err) next(err);
                console.log('permission:' + permission.id + ',' + permission.name);
                callback(null,'');
            });
        },
        function (callback) {
            permission3.save(function (err, permission) {
                if (err) next(err);
                console.log('permission:' + permission.id + ',' + permission.name);
                callback(null,'');
            });
        },
        function (callback) {
            permission4.save(function (err, permission) {
                if (err) next(err);
                console.log('permission:' + permission.id + ',' + permission.name);
                callback(null,'');
            });
        },
        function (callback) {
            permission5.save(function (err, permission) {
                if (err) next(err);
                console.log('permission:' + permission.id + ',' + permission.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.save(function (err, role) {
                if (err) next(err);
                console.log('role:' + role.id + ',' + role.name);
                callback(null,'');
            });
        },
        function (callback) {
            role2.save(function (err, role) {
                if (err) next(err);
                console.log('role:' + role.id + ',' + role.name);
                callback(null,'');
            });
        },
        function (callback) {
            role3.save(function (err, role) {
                if (err) next(err);
                console.log('role:' + role.id + ',' + role.name);
                callback(null,'');
            });
        },
        function (callback) {
            role4.save(function (err, role) {
                if (err) next(err);
                console.log('role:' + role.id + ',' + role.name);
                callback(null,'');
            });
        },
        function (callback) {
            role5.save(function (err, role) {
                if (err) next(err);
                console.log('role:' + role.id + ',' + role.name);
                callback(null,'');
            });
        },
        function (callback) {
            user.save(function (err, user) {
                if (err) next(err);
                console.log('user:' + user.loginName);
                callback(null,'');
            });
        },
        function (callback) {
            user.addRole(role2, function (err, res) {
                console.log('user:' + user.loginName + ',role:' + role2.name);
                callback(null,'');
            });
        },
        function (callback) {
            user.addRole(role3, function (err, res) {
                console.log('user:' + user.loginName + ',role:' + role3.name);
                callback(null,'');
            });
        },
        function (callback) {
            user.addRole(role5, function (err, res) {
                console.log('user:' + user.loginName + ',role:' + role5.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.addPermission(permission1, function (err, res) {
                console.log('role:' + role1.name + ',permission:' + permission1.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.addPermission(permission2, function (err, res) {
                console.log('role:' + role1.name + ',permission:' + permission2.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.addPermission(permission3, function (err, res) {
                console.log('role:' + role1.name + ',permission:' + permission3.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.addPermission(permission4, function (err, res) {
                console.log('role:' + role1.name + ',permission:' + permission4.name);
                callback(null,'');
            });
        },
        function (callback) {
            role1.addPermission(permission5, function (err, res) {
                console.log('role:' + role1.name + ',permission:' + permission5.name);
                callback(null,'');
            });
        },
        function (callback) {
            role2.addPermission(permission1, function (err, res) {
                console.log('role:' + role2.name + ',permission:' + permission1.name);
                callback(null,'');
            });
        },
        function (callback) {
            role2.addPermission(permission2, function (err, res) {
                console.log('role:' + role2.name + ',permission:' + permission2.name);
                callback(null,'');
            });
        },
        function (callback) {
            role2.addPermission(permission4, function (err, res) {
                console.log('role:' + role2.name + ',permission:' + permission4.name);
                callback(null,'');
            });
        },
        function (callback) {
            role3.addPermission(permission3, function (err, res) {
                console.log('role:' + role3.name + ',permission:' + permission3.name);
                callback(null,'');
            });
        },
        function (callback) {
            role5.addPermission(permission5, function (err, res) {
                console.log('role:' + role3.name + ',permission:' + permission5.name);
                callback(null,'');
            });
        }
    ],
    // optional callback
    function (err, results) {
        console.log('insert data finish.......');
    });