angular.module('netcareApp')
    .controller('offSidebarCrtl', function ($scope) {

        $scope.isOpen = false;

        $scope.alarmReceive = false;
        $scope.faultReceive = true;

        $scope.$watch("faultReceive", function (newVal) {
            console.log(newVal);
        });

        $scope.$on('offSidebarTrigger', function () {
            $scope.isOpen = !$scope.isOpen;
        })
    });
