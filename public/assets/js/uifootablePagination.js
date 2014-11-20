angular.module('uiFootablePagination', [])
    .constant('uiFootablePageSize', 20)
    .constant('uiFootablePageEvent',{
        reloadPage: 'uifootable_reload_page',
        pageNoChange: 'uifootable_page_no_change'
    })
    .controller('uiFootablePageCtrl',function($scope, $element, $attrs,
                                              uiFootablePageSize,uiFootablePageEvent){
        $scope.setCurrent = function (pageNo) {
            if(angular.isNumber(pageNo)
                && (0 < pageNo && pageNo <= $scope.pagination.lastPage)){
                $scope.pagination.currentPage = pageNo;
                $scope.$emit(uiFootablePageEvent.pageNoChange, pageNo);
            }
        }
    })
    .directive('uiFootablePagination', function () {
        return{
            restrict: 'A',
            controller: 'uiFootablePageCtrl',
            template: '<ul class="pagination" ng-if="1 < pagination.pageNumber">'
                        + '<li ng-class="{ disabled : pagination.currentPage == 1 }">'
                          + '<a href="" ng-click="setCurrent(1)">&laquo;</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : pagination.currentPage == 1 }">'
                          + '<a href="" ng-click="setCurrent(pagination.currentPage - 1)">&lsaquo;</a>'
                        + '</li>'
                        + '<li class="active">'
                          + '<a href="">{{pagination.currentPage}}&nbsp;&#124;&nbsp;{{ pagination.pageNumber }}&nbsp;&#45;&nbsp;{{pagination.itemSize}}</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : pagination.currentPage == pagination.lastPage }">'
                          + '<a href="" ng-click="setCurrent(pagination.currentPage + 1)">&rsaquo;</a>'
                        + '</li>'
                        + '<li ng-class="{ disabled : pagination.currentPage == pagination.lastPage }">'
                          + '<a href="" ng-click="setCurrent(pagination.lastPage)">&raquo;</a>'
                        + '</li>'
                     + '</ul>',
            link: function (scope, element, attrs) {
            }
        }
    });
