angular.module('netcareApp')
    .controller('netcareCtrl',function($scope,$location,uiNavMenuEvent){

        $scope.focusOverlay = false;

        $scope.$on(uiNavMenuEvent.clickMenuItem, function (event, menu) {
            $scope.selectMenu = menu;
            $scope.$broadcast('menuTrigger');
            $location.path('/'+menu.id);
        });

        $scope.$on('focusOverlay', function () {
            $scope.focusOverlay = !$scope.focusOverlay;
        });
    });
