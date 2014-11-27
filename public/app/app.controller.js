angular.module('netcareApp')
    .controller('netcareCtrl',function($scope,$rootScope,$location,uiNavMenuEvent,socketService,socketConstant){

        $scope.focusOverlay = false;

        $scope.$on(uiNavMenuEvent.clickMenuItem, function (event, menu) {
            $scope.selectMenu = menu;
            $scope.$broadcast('menuTrigger');
            $location.path('/'+menu.id);
        });

        $scope.$on('focusOverlay', function () {
            $scope.focusOverlay = !$scope.focusOverlay;
        });

        socketService.socket.on("disconnect", function(){
            console.log("client disconnected from server");
            $rootScope.$broadcast(socketConstant.websocketStatus,false);
        });
    });
