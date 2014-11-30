angular.module('netcareApp')
    .controller('navMenuCrtl', ['$scope','netcareCache',function ($scope,netcareCache) {

        $scope.isOpen = false;
        $scope.menus = netcareCache.get('menus');

        $scope.$on('menuTrigger', function () {
            $scope.isOpen = !$scope.isOpen;
        });
    }
    ]);
