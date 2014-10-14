exports.Mongodb = {
    url: "mongodb://134.64.14.94:27017/netcare"
}

exports.Amqp = {
    host: '134.64.14.94',
    port: 5672,
    login: 'netcare',
    password: 'netcare',
    vhost: 'netcare-vhost',
    faultExchange: 'netcare-fault',
    currAlarmExchange: 'netcare-currAlarm'
}