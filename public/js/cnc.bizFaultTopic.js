cnc.bizFaultTopic = (function () {

	var topicName = 'bizFaultMessage';

	var connect, disConnect, publish, subscribe, unsubscribe;

	var intervalId;

	connect = function () {
		intervalId = setInterval(function () {
			var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
			console.log('intervalId:' + intervalId+' '+time);		
			var bizFault = {
				circuitNo:'01T017417',
				customerGroupName:'施耐德电气(中国)有限公司',
				beginTime:time,
				state:'NEW'
			};	
			publish(bizFault);
		}, 3000);
		$.gevent.publish('bizFaultStatus', true);
	};

	disConnect = function () {
		clearInterval(intervalId);
		$.gevent.publish('bizFaultStatus', false);
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