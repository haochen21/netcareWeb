angular.module('netcareApp')
    .controller('offSidebarCrtl', function ($scope,$rootScope,socketService,socketConstant,netcareCache) {

        $scope.isOpen = false;

        $scope.alarmReceive = false;
        $scope.faultReceive = true;

        $scope.$watch("faultReceive", function (newVal) {
            if(newVal){
                socketService.connectFault();
            }else{
                socketService.disConnectFault();
            }
            $rootScope.$broadcast(socketConstant.websocketStatus,newVal);
        });

        $scope.$on(socketConstant.websocketStatus,function(event, value){
            if(!value){
                $scope.faultReceive = false;
                $scope.alarmReceive = false;
            }
        });
        var user = netcareCache.get("user");
        $scope.userName = user.name;

        $scope.$on('offSidebarTrigger', function () {
            $scope.isOpen = !$scope.isOpen;
        });
    });
