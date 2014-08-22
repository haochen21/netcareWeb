var express = require('express');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var config = require('./app/config');
var socket = require('./app/socket');

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

checkUser = routes.main.checkUser;
checkAdmin = routes.main.checkAdmin;
checkApplicant = routes.main.checkApplicant;

app.post('/api/login', routes.main.login);
app.post('/api/logout', routes.main.logout);

app.get('/api/users/:id', checkAdmin, routes.security.getUser);
app.get('/api/users/permissions/:id', checkAdmin, routes.security.getUserPermissions);
app.post('/api/users', checkAdmin, routes.security.addUser);
app.put('/api/users/:id', checkAdmin, routes.security.updateUser);
app.delete('/api/users/:id', checkAdmin, routes.security.deleteUser);


app.use(logErrors);
app.use(errorHandler);
if (require.main === module) {
    app.listen(app.get('port'), function () {
        console.info('server listening on port ' + app.get('port'));
    });
} else {
    console.info('Running app as a module');
    exports.app = app;
}

//start fault&alarm socket
socket.initialize(server);