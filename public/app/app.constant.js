angular.module('netcareApp')
    .constant('socketConstant', {
        websocketStatus:'websocketStatus',
        faultSocketName: 'faultMessage',
        faultConnectCommand:'connect-faultSocket',
        faultDisconnectCommand:'disconnect-faultSocket',
        faultMessageStatus:'faultMessageStatus',
        faultMessageTopicName: 'faultTopic'
    }
);
