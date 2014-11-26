angular.module('ngFootablePagination', [])
    .constant('ngFootablePageSize', 20)
    .constant('ngFootablePageEvent',{
        reloadPage: 'ngfootable_reload_page'
    })
    .controller('ngFootablePageCtrl',function($scope, $element, $attrs,
                                              ngFootablePageSize,ngFootablePageEvent){
        $scope.setCurrent = function (page) {
            if(angular.isNumber(page)
                && (0 < page && page <= $scope.pageNum)){
                $scope.currentPage = page;
                $scope.onSelectPage({page:$scope.currentPage});
            }
        }
    })
    .directive('ngFootablePagination', function () {
        return{
            restrict: 'EA',
            controller: 'ngFootablePageCtrl',
            scope: {
                itemSize: '=',
                pageNum: '=',
                currentPage: '=',
                onSelectPage: '&'
            },
            template: '<ul class="pagination" ng-if="1 < pageNum">'
                        + '<li ng-class="{ disabled : currentPage == 1 }">'
                          + '<a href="" ng-click="setCurrent(1)">&laquo;</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : currentPage == 1 }">'
                          + '<a href="" ng-click="setCurrent(currentPage - 1)">&lsaquo;</a>'
                        + '</li>'
                        + '<li class="active">'
                          + '<a href="">{{currentPage}}&nbsp;&#124;&nbsp;{{pageNum}}&nbsp;&#45;&nbsp;{{itemSize}}</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : currentPage == pageNum }">'
                          + '<a href="" ng-click="setCurrent(currentPage + 1)">&rsaquo;</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : currentPage == pageNum }">'
                          + '<a href="" ng-click="setCurrent(pageNum)">&raquo;</a>'
                        + '</li>'
                     + '</ul>',
            link: function (scope, element, attrs) {
            }
        }
    });
