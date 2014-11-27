var socketio = require('socket.io');
var amqp = require('amqp');
var config = require('./config');

exports.initialize = function (server) {
    var io = socketio(server);
    io.on('connection', function (socket) {
        socket.on('connect-faultSocket', function (room) {
            console.log('join fault room');
            socket.join('faultSocket');
        });
        socket.on('disconnect-faultSocket', function (room) {
            console.log('leave fault room');
            socket.leave('faultSocket');
        });
        socket.on('connect-alarmSocket', function (room) {
            console.log('join alarm room');
            socket.join('alarmSocket');
        });
        socket.on('disconnect-alarmSocket', function (room) {
            console.log('leave alarm room');
            socket.leave('alarmSocket');
        });
    });
    var rabbitMq = amqp.createConnection({
        host: config.Amqp.host,
        port: config.Amqp.port,
        login: config.Amqp.login,
        password: config.Amqp.password,
        vhost: config.Amqp.vhost
    });
    rabbitMq.on('ready', function () {
        console.log('rabbitMq is ready!');
        rabbitMq.queue('fault-nodeJs', {
            durable: true,
            autoDelete: false,
            exclusive: true
        }, function (queue) {
            queue.bind('netcare-fault', '');
            queue.subscribe(function (message, headers, deliveryInfo, messageObject) {
                var msg = JSON.parse(message.data.toString());
                console.log(msg.id);
                io.to('faultSocket').emit('faultMessage', msg);
            });
        });
        rabbitMq.queue('alarm-nodeJs', {
            durable: true,
            autoDelete: false,
            exclusive: true
        }, function (queue) {
            queue.bind('netcare-currAlarm', '');
            queue.subscribe(function (message, headers, deliveryInfo) {
                var msg = JSON.parse(message.data.toString());
                //console.log(msg.id);
                io.to('alarmSocket').emit('alarmMessage', msg);
            });
        });
    });

    rabbitMq.on('error', function(e) {
        console.log("connection error...", e);
    })
}