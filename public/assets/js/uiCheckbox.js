angular.module('uiCheckbox', [])
    .directive('uiCheckbox', function ($compile) {
        return {
            restrict: "EA",
            scope: {
                local:'=checkModel'
            },
            template: '<label><h6>{{checkName}}</h6></label>'
                +'<div class="pull-right">'
                +'<label class="switch">'
                +'<input type="checkbox" ng-model="local">'
                +'<span></span>'
                +'</a>'
                +'</label>',
            link: function (scope, $element, attrs) {
               scope.checkName = attrs["checkName"] || '';
            }
        }
    });