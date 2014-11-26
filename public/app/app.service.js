angular.module('netcareApp')
    .factory('messaging', function () {

        var cache = {};

        var subscribe = function (topic, callback) {
            if (!cache[topic]) {
                cache[topic] = [];
            }
            cache[topic].push(callback);
            return [topic, callback];
        };

        var public = function (topic, args) {
            cache[topic] && angular.forEach(cache[topic],
                function (callback) {
                    callback.apply(null, args || []);
                })
        };

        var unsubscribe = function(handleArray){
            var topic = handleArray[0];
            if(cache[topic]){
                var length = cache[topic].length;
                for(var i=0;i<length;i++){
                    if(cache[topic][i] === handleArray[1]){
                        cache[topic].splice(i,1);
                        // Adjust counter and length for removed item
                        i--;
                        length--;
                    }
                }
            }
        };

        var service = {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;
    });
