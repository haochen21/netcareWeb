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
        rabbitMq.queue('fault-nodeJs-test', {
            durable: false,//true 重启之后会重新建立
            autoDelete: true,//最后一个消费者断开的时候自动删除
            exclusive: false //True，只有创建这个队列的消费者程序才允许连接到该队列
        }, function (queue) {
            queue.bind('netcare-fault', '');
            queue.subscribe(function (message, headers, deliveryInfo, messageObject) {
                var msg = JSON.parse(message.data.toString());
                console.log(msg.id);
                io.to('faultSocket').emit('faultMessage', msg);
            });
        });
        rabbitMq.queue('alarm-nodeJs-test', {
            durable: false,
            autoDelete: true,
            exclusive: false
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