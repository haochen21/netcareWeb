angular.module('uiFootable', [])
    .constant('uiFootableClass', {
        toggle: 'uifootable-toggle',
        toggleOpen: 'open-detail-row',
        disabled: 'uifootable-disabled',
        detail: 'uifootable-row-detail',
        detailCell: 'uifootable-row-detail-cell',
        detailInner: 'uifootable-row-detail-inner',
        detailInnerRow: 'uifootable-row-detail-row',
        detailInnerGroup: 'uifootable-row-detail-group',
        detailInnerName: 'uifootable-row-detail-name',
        detailInnerValue: 'uifootable-row-detail-value',
        detailShow: 'uifootable-detail-show'
    })
    .constant('uiFootableEvent', {
        allRowsCollapse: 'uifootable_all_row_collapse',
        allRowsExpand: 'uifootable_all_row_expand'
    })
    .constant('uiFootableBreakPoints', {
        phone: 480,
        tablet: 1024
    })
    .controller('uiFootableCtrl',function($scope){

        $scope.sortBy = function(value,index){
            if($scope.$columns[index].sortType === '') {
                $scope.$columns[index].sortType = 'desc';
            }else if($scope.$columns[index].sortType === 'asc'){
                $scope.$columns[index].sortType = 'desc';
            }else if($scope.$columns[index].sortType === 'desc') {
                $scope.$columns[index].sortType = 'asc';
            }

            if ($scope.sort == value){
                $scope.reverse = !$scope.reverse;
                return;
            }

            $scope.sort = value;
            $scope.reverse = false;

        }
    })
    .directive("uiFootable", function ($compile, $window, $document, uiFootableClass, uiFootableEvent, uiFootableBreakPoints) {
        return {
            restrict: 'A',
            priority: 1001,
            controller: 'uiFootableCtrl',
            scope: true,
            compile: function (element, attributes) {
                angular.element(element).addClass('ui-footable');
                var columns = [];
                var thItems = element.find("th");
                for (var i = 0; i < thItems.length; i++) {
                    var $th = thItems.eq(i);
                    var hide = $th.attr('data-hide');
                    hide = hide || '';
                    hide = hide.split(',').map(function (value) {
                        return value;
                    });
                    var column = {
                        'show': true,
                        'hide': hide,
                        'type': $th.attr('data-type') || 'alpha',
                        'name': $th.attr('data-name') || $th.text().trim(),
                        'ignore': $th.attr('data-ignore') || false,
                        'toggle': $th.attr('data-toggle') || false,
                        'sort': $th.attr('data-sort') || false,
                        'sortType':''
                    };
                    columns.push(column);
                    if(column.sort){
                        $th.text('');
                        $th.addClass("sortable");
                        $th.append(angular.element('<div>').addClass('sort-indicator').text(column.name));
                        $th.attr('ng-click',"sortBy('"+column.sort+"'"+","+i+")");
                    }
                    $th.attr('ng-class',"{'sort-asc':$columns["+i+"].sortType === 'asc','sort-desc':$columns["+i+"].sortType === 'desc'}")
                    $th.attr('ng-show', '$columns[' + i + '].show');
                }

                var $tbodyItem = element.find("tbody").eq(0);
                var $trItem = $tbodyItem.find("tr").eq(0);
                //add tr click listener(open or close detail panel)
                $trItem.attr('ng-click', 'rowClick($event,$index)');

                var $rowDetail = angular.element('<tr style="display:none;" ng-repeat-end>').addClass(uiFootableClass.detail);
                var $rowDetailCell = angular.element('<td colspan="{{$columns.length}}">').addClass(uiFootableClass.detailCell);
                $rowDetail.append($rowDetailCell);
                var $rowDetailInner = angular.element('<div>').addClass(uiFootableClass.detailInner);
                $rowDetailCell.append($rowDetailInner);

                //add detail after tr
                $trItem.after($rowDetail);

                var tdItems = $trItem.find("td");
                for (var i = 0; i < tdItems.length; i++) {
                    var $thItem = tdItems.eq(i);
                    //add ng-show directive to td
                    $thItem.attr('ng-show', '$columns[' + i + '].show');
                    //add open or close toggle to td
                    if (columns[i].toggle) {
                        $thItem.prepend(angular.element('<span>').addClass(uiFootableClass.toggle)
                            .addClass(uiFootableClass.toggleClose).
                            append(angular.element('<i class="fa fa-lg fa-plus-circle"></i><i class="fa fa-lg fa-minus-circle txt-color-red"></i>')));
                    }
                    var $rowDetailRow = angular.element('<div>')
                        .addClass(uiFootableClass.detailInnerRow);
                    //if table column is hide then detail row show info
                    $rowDetailRow.attr('ng-show', '!$columns[' + i + '].show');
                    var $rowDetailName = angular.element('<div>')
                        .addClass(uiFootableClass.detailInnerName).text(columns[i].name);
                    $rowDetailRow.append($rowDetailName);

                    var $rowDetailItem = angular.element('<div">' + tdItems[i].innerHTML + '</div>')
                        .addClass(uiFootableClass.detailInnerValue);
                    $rowDetailRow.append($rowDetailItem);

                    $rowDetailInner.append($rowDetailRow);
                }

                return function (scope, element, attrs) {
                    scope.$columns = columns;

                    scope.$on(uiFootableEvent.allRowsExpand, function () {
                        var tbodyItem = element.find("tbody").eq(0);
                        var trItem = tbodyItem.find("tr");
                        for (var i = 0; i < trItem.length; i++) {
                            var isDetail = trItem.eq(i).hasClass(uiFootableClass.detail);
                            if (isDetail) {
                                trItem.eq(i).attr("style", "display:table-row;");
                            }else{
                                trItem.eq(i).toggleClass(uiFootableClass.toggleOpen);
                            }
                        }
                    });

                    scope.$on(uiFootableEvent.allRowsCollapse, function () {
                        var tbodyItem = element.find("tbody").eq(0);
                        var trItem = tbodyItem.find("tr");
                        for (var i = 0; i < trItem.length; i++) {
                            var isDetail = trItem.eq(i).hasClass(uiFootableClass.detail);
                            if (isDetail) {
                                trItem.eq(i).attr("style", "display:none;");
                            }else{
                                trItem.eq(i).toggleClass(uiFootableClass.toggleOpen);
                            }
                        }
                    });

                    scope.rowClick = function ($event,index) {
                        //get click column
                        // if column is checkbox,ignore row expand
                        var isCheckItem = false;

                        var $columnTarget = angular.element($event.target);
                        var inputItems = $columnTarget.find('input');
                        if (inputItems.length > 0) {
                            var inputItem = inputItems[0];
                            if (inputItem.type === 'checkbox') {
                                isCheckItem = true;
                            }
                        }
                        if (isCheckItem) {
                            return;
                        }

                        //get click row(tr)
                        var $target = angular.element($event.currentTarget);
                        //get toggle column
                        var tdItems = $target.find('td');
                        $target.toggleClass(uiFootableClass.toggleOpen);
                        var displayValue = $target.next().attr('style');
                        if (displayValue === 'display:none;') {
                            $target.next().attr('style', 'display:table-row;');
                        }
                        else {
                            $target.next().attr('style', 'display:none;');
                        }
                    }

                    scope.setColumnShow = function () {
                        for (var i = 0; i < scope.$columns.length; i++) {
                            if (scope.$columns[i].hide.indexOf('all') != -1) {
                                scope.$columns[i].show = false;
                            } else if (columns[i].hide.indexOf('phone') != -1 && scope.windowWidth <= uiFootableBreakPoints.phone) {
                                scope.$columns[i].show = false;
                            } else if (columns[i].hide.indexOf('tablet') != -1 && scope.windowWidth <= uiFootableBreakPoints.tablet) {
                                scope.$columns[i].show = false;
                            } else {
                                scope.$columns[i].show = true;
                            }
                        }
                    }

                    scope.getViewportWidth = function () {
                        return $window.innerWidth || ($document.body ? $document.body.offsetWidth : 0);
                    };

                    var window = angular.element($window);
                    scope.windowWidth = scope.getViewportWidth();
                    window.bind('resize', function () {
                        scope.$apply(function () {
                            scope.windowWidth = scope.getViewportWidth();
                        });
                    });

                    scope.$watch('windowWidth', function (newValue, oldValue) {
                        scope.setColumnShow();
                    });
                }
            }
        }
    })
    .directive('ngIndeterminate', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                attributes.$observe('ngIndeterminate', function (value) {
                    element.prop('indeterminate', value == "true");
                });
            }
        };
    })
    .directive('uiFootableCheckbox', function () {
        return {
            restrict: 'A',
            replace:true,
            scope: {
                source:'=checkModel'
            },
            template: '<label class="checkbox">'
                + '<input type="checkbox" ng-model="source">'
                + '<span class="lbl"></span>'
                + '</label>',
            link: function (scope, element, attributes) {
            }
        };
    })
;