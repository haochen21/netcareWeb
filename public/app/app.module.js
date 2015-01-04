angular.module('netcareApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ngTouch', 'uiNavMenu',
    'uiCheckbox', 'ngFootable', 'ngFootablePagination', 'ngHighchart', 'ui.select', 'pdf', 'ui.bootstrap'])
    .config(function (socketServiceProvider) {
        socketServiceProvider.init();
    }).directive('disableAnimation', ['$animate',function ($animate) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $attrs.$observe('disableAnimation', function (value) {
                    $animate.enabled(!value, $element);
                });
            }
        }
    }]);