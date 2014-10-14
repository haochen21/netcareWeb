cnc.faultSocket = (function () {

	var topicName = 'faultMessage';

	var connect, disConnect, publish, subscribe, unsubscribe;

	var faultSocket;

	connect = function () {
        faultSocket = io.connect();
        faultSocket.on('connect', function () {
            faultSocket.emit('connect-faultSocket');
        });
        faultSocket.on('faultMessage', function (msg) {
            console.log(msg);
            publish(msg);
        });
		$.gevent.publish('faultStatus', true);
	};

	disConnect = function () {
        faultSocket.emit('disconnect-faultSocket');
		$.gevent.publish('faultStatus', false);
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