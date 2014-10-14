cnc.alarmSocket = (function () {

	var topicName = 'alarmMessage';

	var connect, disConnect, publish, subscribe, unsubscribe;

	var alarmSocket = io.connect();
    alarmSocket.on('alarmMessage', function (msg) {
        console.log(msg);
        publish(msg);
    });

	connect = function () {
        alarmSocket.emit('connect-alarmSocket');
		$.gevent.publish('alarmStatus', true);
	};

	disConnect = function () {
        alarmSocket.emit('disconnect-alarmSocket');
		$.gevent.publish('alarmStatus', false);
	};

	publish = function (data) {
		amplify.publish(topicName, data);
	};

	subscribe = function (callback) {
		amplify.subscribe(topicName, callback);
	};

	unsubscribe = function (callback) {
		amplify.unsubscribe(topicName, callback);
	};

	return {
		connect: connect,
		disConnect: disConnect,
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}());