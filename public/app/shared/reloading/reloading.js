angular.module('netcareApp')
    .directive('uiReloading', function () {
        return {
            restrict: 'AE',
            replace: true,
            template:'<div class="panel-reload-layer" ng-show="reloading"><i class="fa fa-spinner fa-4x fa-spin"></i></div>',
            controller: function ($scope, $element, $attrs) {

            },
            scope: {
                reloading: '=reloadingModel'
            },
            link: function (scope, element, attrs) {

            }
        }
    })
