angular.module('netcareApp')
    .controller('netcareCtrl',function($scope,$rootScope,uiNavMenuEvent){

        $scope.$on(uiNavMenuEvent.clickMenuItem, function (event, menu) {
            $scope.selectMenu = menu;
            $rootScope.$broadcast('menuTrigger');
        });
    });
