var socketio = require('socket.io');
var amqp = require('amqp');
var config = require('./config');

exports.initialize = function (server) {
    var io = socketio(server);
    var rabbitMq = amqp.createConnection({
        host: config.Amqp.host,
        port: config.Amqp.port,
        login: config.Amqp.login,
        password: config.Amqp.password,
        vhost: config.Amqp.vhost
    });
    rabbitMq.on('ready', function () {
        console.log('rabbitMq is ready!');
        io.of('/faultMessage')
            .on('connection', function (socket) {
                console.log('faultMessage is connection!');
                rabbitMq.queue('fault-node', {
                    durable: false,
                    autoDelete: true,
                    exclusive: true
                }, function (queue) {
                    queue.bind('netcare-fault', '');
                    queue.subscribe(function (message, headers, deliveryInfo) {
                        socket.broadcast.emit('faultMessage', message);
                    });
                });
            });
        io.of("/alarmMessage")
            .on("connection", function (socket) {
                console.log('alarmMessage is connection!');
                rabbitMq.queue('alarm-node', {
                    durable: false,
                    autoDelete: true,
                    exclusive: true
                }, function (queue) {
                    queue.bind('netcare-alarm', '');
                    queue.subscribe(function (message, headers, deliveryInfo) {
                        socket.broadcast.emit('alarmMessage', message);
                    });
                });
            });
    });
}