angular.module('netcareApp')
    .controller('offSidebarCrtl', function ($scope,socketService) {

        $scope.isOpen = false;

        $scope.alarmReceive = false;
        $scope.faultReceive = true;

        $scope.$watch("faultReceive", function (newVal) {
            console.log(newVal);
            if(newVal){
                socketService.connectFault();
            }else{
                socketService.disConnectFault();
            }
        });

        $scope.$on('offSidebarTrigger', function () {
            $scope.isOpen = !$scope.isOpen;
        })
    });
