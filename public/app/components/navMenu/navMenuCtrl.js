angular.module('netcareApp')
    .controller('navMenuCrtl', function ($scope,$http) {

        $scope.isOpen = false;

        $scope.loadData = function () {
            $http.get('json/menu.json').success(function (data) {
                $scope.menus = data;
            });
        }

        $scope.$on('menuTrigger', function () {
            $scope.isOpen = !$scope.isOpen;
        })

        $scope.loadData();
    });
