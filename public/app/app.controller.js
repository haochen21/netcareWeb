angular.module('netcareApp')
    .controller('netcareCtrl',function($scope,$rootScope,$location,uiNavMenuEvent){

        $scope.$on(uiNavMenuEvent.clickMenuItem, function (event, menu) {
            $scope.selectMenu = menu;
            $rootScope.$broadcast('menuTrigger');
            $location.path('/'+menu.id);
        });
    });
