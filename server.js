var express = require('express');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
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
//mongodbConnect();

mongoose.connection.on('error', function (err) {
    console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
    mongodbConnect();
});

mongoose.connection.once('open', function () {
    console.info('connected to database');
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})
var routes = require('./routes');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(expressSession({
    secret: '1234567890QWERTY',
    saveUninitialized: true,
    resave: true
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

function logErrors(err, req, res, next) {
    console.error('logErrors', err.toString());
    next(err);
}

function errorHandler(err, req, res, next) {
    var message = JSON.stringify(err, ['stack', 'message'], 2);
    console.error(message);
    res.status(500).send({
        error: err.toString()
    });
}

var router = express.Router();

checkUser = routes.main.checkUser;
checkAdmin = routes.main.checkAdmin;
checkApplicant = routes.main.checkApplicant;

router.route('/login')
    .post(routes.main.login);

router.route('/logout')
    .post(routes.main.logout);

router.route('/users')
    .get(checkAdmin, routes.security.getUsers)
    .post(checkAdmin, routes.security.addUser);

router.route('/users/:id')
    .get(checkAdmin, routes.security.getUser)
    .put(checkAdmin, routes.security.updateUser)
    .delete(checkAdmin, routes.security.deleteUser);

router.route('/users/roles/:id')
    .put(checkAdmin, routes.security.updateUserRoles);

router.route('/roles')
    .get(checkAdmin, routes.security.getRoles)
    .post(checkAdmin, routes.security.addRole);

router.route('/roles/:id')
    .get(checkAdmin, routes.security.getRole)
    .put(checkAdmin, routes.security.updateRole)
    .delete(checkAdmin, routes.security.deleteRole);

router.route('/permissions')
    .get(checkAdmin, routes.security.getPermissions)
    .post(checkAdmin, routes.security.addPermission);

router.route('/permissions/:id')
    .get(checkAdmin, routes.security.getPermission)
    .put(checkAdmin, routes.security.updatePermission)
    .delete(checkAdmin, routes.security.deletePermission);

router.route('/circuit')
    .post(routes.circuit.getCircuit);

app.use('/api', router);

app.use(logErrors);
app.use(errorHandler);

var socket = require('./app/socket');
socket.initialize(server);

if (require.main === module) {
    server.listen(app.get('port'), function () {
        console.info('server listening on port ' + app.get('port'));
    });
} else {
    console.info('Running app as a module');
    exports.app = app;
}

