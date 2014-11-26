angular.module('netcareApp')
    .constant('socketConstant', {
        faultSocketName: 'faultMessage',
        faultConnectCommand:'connect-faultSocket',
        faultDisconnectCommand:'disconnect-faultSocket',
        faultMessageStatus:'faultMessageStatus',
        faultMessageTopicName: 'faultTopic'
    }
);
