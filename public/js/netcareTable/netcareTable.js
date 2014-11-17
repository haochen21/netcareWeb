angular.module('netcareTable', [])
    .constant('ncTableClass', {
        toggle: 'nctable-toggle',
        toggleOpen: 'nctable-toggle-open',
        toggleClose: 'nctable-toggle-close',
        disabled: 'nctable-disabled',
        detail: 'nctable-row-detail',
        detailCell: 'nctable-row-detail-cell',
        detailInner: 'nctable-row-detail-inner',
        detailInnerRow: 'nctable-row-detail-row',
        detailInnerGroup: 'nctable-row-detail-group',
        detailInnerName: 'nctable-row-detail-name',
        detailInnerValue: 'nctable-row-detail-value',
        detailShow: 'nctable-detail-show'
    })
    .constant('ncTableEvent', {
        allRowsCollapse: 'nctable_all_row_collapse',
        allRowsExpand: 'nctable_all_row_expand'
    })
    .constant('ncTableBreakPoints', {
        phone: 480,
        tablet: 1024
    })
    .controller('ncTableCtrl', function ($scope, $window, $document, ncTableClass) {

    })
    .directive("netcareTable", function ($compile, $window, $document, ncTableClass, ncTableEvent, ncTableBreakPoints) {
        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: 'ncTableCtrl',
            compile: function (element, attributes) {
                var columns = [];
                var thItems = element.find("th");
                for (var i = 0; i < thItems.length; i++) {
                    var hide = thItems.eq(i).attr('data-hide');
                    hide = hide || '';
                    hide = hide.split(',').map(function (value) {
                        return value;
                    });
                    var column = {
                        'show': true,
                        'hide': hide,
                        'type': thItems.eq(i).attr('data-type') || 'alpha',
                        'name': thItems.eq(i).attr('data-name') || thItems.eq(i).text().trim(),
                        'ignore': thItems.eq(i).attr('data-ignore') || false,
                        'toggle': thItems.eq(i).attr('data-toggle') || false,
                        'className': thItems.eq(i).attr('class') || null,
                        'matches': [],
                        'names': {},
                        'group': thItems.eq(i).attr('data-group') || null,
                        'groupName': null
                    };
                    columns.push(column);
                    thItems.eq(i).attr('ng-show', '$columns[' + i + '].show');
                }
                var tbodyItem = element.find("tbody").eq(0);
                var trItem = tbodyItem.find("tr").eq(0);
                //add tr click listener(open or close detail panel)
                trItem.attr('ng-click', 'rowClick($event)');

                var rowDetail = angular.element('<tr style="display:none;" ng-repeat-end>').addClass(ncTableClass.detail);
                var rowDetailCell = angular.element('<td colspan="{{$columns.length}}">').addClass(ncTableClass.detailCell);
                rowDetail.append(rowDetailCell);
                var rowDetailInner = angular.element('<div>').addClass(ncTableClass.detailInner);
                rowDetailCell.append(rowDetailInner);

                //add detail after tr
                trItem.after(rowDetail);

                var tdItems = trItem.find("td");
                for (var i = 0; i < tdItems.length; i++) {
                    //add ng-show directive to td
                    tdItems.eq(i).attr('ng-show', '$columns[' + i + '].show');
                    //add open or close toggle to td
                    if (columns[i].toggle) {
                        tdItems.eq(i).prepend(angular.element('<span>').addClass(ncTableClass.toggle)
                            .addClass(ncTableClass.toggleClose).
                            append(angular.element('<i class="fa fa-lg fa-plus-circle"></i><i class="fa fa-lg fa-minus-circle txt-color-red"></i>')));
                    }
                    var rowDetailRow = angular.element('<div>')
                        .addClass(ncTableClass.detailInnerRow);
                    //if table column is hide then detail row show info
                    rowDetailRow.attr('ng-show', '!$columns[' + i + '].show');
                    var rowDetailName = angular.element('<div>')
                        .addClass(ncTableClass.detailInnerName).text(columns[i].name);
                    rowDetailRow.append(rowDetailName);

                    var rowDetailItem = angular.element('<div">' + tdItems[i].innerHTML + '</div>')
                        .addClass(ncTableClass.detailInnerValue);
                    rowDetailRow.append(rowDetailItem);

                    rowDetailInner.append(rowDetailRow);
                }

                return function (scope, element, attrs) {
                    scope.$columns = columns;

                    scope.$on(ncTableEvent.allRowsExpand, function () {
                        var tbodyItem = element.find("tbody").eq(0);
                        var trItem = tbodyItem.find("tr");
                        for (var i = 0; i < trItem.length; i++) {
                            var isDetail = trItem.eq(i).hasClass(ncTableClass.detail);
                            if (isDetail) {
                                trItem.eq(i).attr("style", "display:table-row;");
                            }
                        }
                    });
                    scope.$on(ncTableEvent.allRowsCollapse, function () {
                        var tbodyItem = element.find("tbody").eq(0);
                        var trItem = tbodyItem.find("tr");
                        for (var i = 0; i < trItem.length; i++) {
                            var isDetail = trItem.eq(i).hasClass(ncTableClass.detail);
                            if (isDetail) {
                                trItem.eq(i).attr("style", "display:none;");
                            }
                        }
                    });

                    scope.rowClick = function ($event) {
                        //get click row(tr)
                        var target = angular.element($event.currentTarget);
                        //get toggle column
                        var tdItems = target.find('td');
                        var toggleItem;
                        for (var i = 0; i < tdItems.length; i++) {
                            var spanItems = tdItems.eq(i).find('span');
                            if (toggleItem) {
                                break;
                            }
                            for (var j = 0; j < spanItems.length; j++) {
                                if (spanItems.hasClass(ncTableClass.toggle)) {
                                    toggleItem = spanItems.eq(i);
                                    break;
                                }
                            }
                        }
                        var displayValue = target.next().attr('style');
                        if (displayValue === 'display:none;') {
                            target.next().attr('style', 'display:table-row;');
                            toggleItem.removeClass(ncTableClass.toggleClose);
                            toggleItem.addClass(ncTableClass.toggleOpen);
                        }
                        else {
                            target.next().attr('style', 'display:none;');
                            toggleItem.removeClass(ncTableClass.toggleOpen);
                            toggleItem.addClass(ncTableClass.toggleClose);
                        }
                    }

                    scope.setColumnShow = function () {
                        for (var i = 0; i < scope.$columns.length; i++) {
                            if (scope.$columns[i].hide.indexOf('all') != -1) {
                                scope.$columns[i].show = false;
                            } else if (columns[i].hide.indexOf('phone') != -1 && scope.windowWidth <= ncTableBreakPoints.phone) {
                                scope.$columns[i].show = false;
                            } else if (columns[i].hide.indexOf('tablet') != -1 && scope.windowWidth <= ncTableBreakPoints.tablet) {
                                scope.$columns[i].show = false;
                            } else{
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
                        scope.$apply(function() {
                            scope.windowWidth = scope.getViewportWidth();
                        });
                    });

                    scope.$watch('windowWidth', function (newValue, oldValue) {
                        scope.setColumnShow();
                    });

                    scope.$watch(attrs.netcareTable, (function (params) {

                    }));
                }
            }
        }
    });