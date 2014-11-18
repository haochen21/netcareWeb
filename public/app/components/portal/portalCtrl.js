angular.module('netcareApp')
    .controller('portalCtrl', function ($scope) {

        $scope.focusEnabled = {
            eyeSlash:false,
            customerInfo:false,
            circuitStatus:false,
            customerCircuit:false,
            sla:false
        };

        $scope.setFocusOverlay = function(value){
            $scope.focusEnabled.eyeSlash = !$scope.focusEnabled.eyeSlash;
            $scope.focusEnabled[value] = !$scope.focusEnabled[value];
            $scope.$emit('focusOverlay');
        }
    });
