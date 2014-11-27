angular.module('netcareApp')
    .controller('lockCtrl', function ($scope) {

        $scope.show = false;

        $scope.unlock = function(){
            $scope.show = false;
        }

        $scope.$on('lock', function () {
            $scope.show = true;
        })
    });
