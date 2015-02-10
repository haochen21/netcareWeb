angular.module('ngHighchart', [])
    .directive('hcPie', function ($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                items: '='
            },
            controller: function ($scope, $element, $attrs) {

            },
            link: function (scope, element, attrs) {
                $timeout(function(){
                    var outSize = attrs.outSize ? attrs.outSize : '100%',
                        innerSize = attrs.innerSize ? attrs.innerSize : '0%',
                        backgroundColor = attrs.backgroundColor ? attrs.backgroundColor : '#FFFFFF',
                        labelColor =  attrs.labelColor ? attrs.labelColor : "#4383b4",
                        labelConnectorColor = attrs.labelConnectorColor ? attrs.labelConnectorColor : "#000000";
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: angular.element(element).attr('id'),
                            height: angular.element(element).attr('height'),
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            backgroundColor:backgroundColor
                        },
                        title: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                return "<b>" + this.point.name + "</b>: " + Highcharts.numberFormat(this.percentage, 1) + " %";
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: false,
                                cursor: "pointer",
                                dataLabels: {
                                    enabled: true,
                                    color: labelColor,
                                    connectorColor: labelConnectorColor,
                                    connectorPadding: 3,
                                    formatter: function () {
                                        return "<b>" + this.point.name + "</b>:" + this.y;
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                type: 'pie',
                                name: 'Browser share',
                                size: outSize,
                                innerSize: innerSize,
                                data: scope.items
                            }
                        ]
                    });
                    scope.$watch("items", function (newValue) {
                       chart.series[0].setData(newValue, true);
                    }, true);
                },0);

            }
        }
    })
    .directive('hcPieDonut', function ($window,$timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                innerItems: '=',
                outerItems: '=',
                title: '='
            },
            controller: function ($scope, $element, $attrs) {

            },
            link: function (scope, element, attrs) {
                $timeout(function(){
                    var outSize = attrs.outSize ? attrs.outSize : '100%',
                        innerSize = attrs.innerSize ? attrs.innerSize : '0%',
                        backgroundColor = attrs.backgroundColor ? attrs.backgroundColor : '#FFFFFF',
                        labelColor =  attrs.labelColor ? attrs.labelColor : "#4383b4",
                        labelConnectorColor = attrs.labelConnectorColor ? attrs.labelConnectorColor : "#000000";

                    var windowWidth = $window.innerWidth || ($document.body ? $document.body.offsetWidth : 0);

                    var chart = new Highcharts.Chart({
                        chart: {
                            type: 'pie',
                            renderTo: angular.element(element).attr('id'),
                            height: angular.element(element).attr('height'),
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            backgroundColor:backgroundColor
                        },
                        title: {
                            text: scope.title
                        },
                        credits: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                return "<b>" + this.point.name +":"+this.point.y+"分钟"+ "</b></b><br/>" + Highcharts.numberFormat(this.percentage, 1) + " %";
                            }
                        },
                        plotOptions: {
                            pie: {
                                shadow: false,
                                center: ['50%', '50%']
                            }
                        },
                        series: [
                            {
                                data: scope.innerItems,
                                size: innerSize,
                                dataLabels: {
                                    formatter: function () {
                                        return '<b>' + this.point.name + ':</b> ' + this.y + '';
                                    },
                                    color: 'white',
                                    distance: -50
                                }
                            },
                            {
                                data: scope.outerItems,
                                size: outSize,
                                innerSize: innerSize,
                                dataLabels: {
                                    formatter: function () {
                                        return '<b>' + this.point.name + '</b><br><br> ' + this.y + '';
                                    },
                                    distance: windowWidth>768?40:10
                                }
                            }
                        ]
                    });

                    scope.$watch("innerItems", function (newValue) {
                        chart.series[0].setData(newValue, true);
                    }, true);
                    scope.$watch("outerItems", function (newValue) {
                        chart.series[1].setData(newValue, true);
                    }, true);
                    scope.$watch("title", function (newValue) {
                        chart.setTitle({text: newValue});
                    }, true);
                },0);
            }
        }
    })
    .directive('hcColumn', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                items: '='
            },
            controller: function ($scope, $element, $attrs) {

            },
            link: function (scope, element, attrs) {
                var aaaaa = angular.element(element).attr('name');
                console.log(aaaaa);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: angular.element(element).attr('id'),
                        height: angular.element(element).attr('height'),
                        type: "column",
                        zoomType: "x"
                    },
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        categories: [].map.call(scope.items, function (obj) {
                            return obj.name;
                        }),
                        labels: {
                            staggerLines: 2,
                            style: {
                                color: "#4383b4",
                                fontWeight: "normal"
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: Math.max.apply(null,[].map.call(scope.items, function (obj) {
                            return obj.value;
                        })),
                        title: {
                            text: null
                        }
                    },
                    series: [
                        {
                            name: angular.element(element).attr('name'),
                            showInLegend: false,
                            data: [].map.call(scope.items, function (obj) {
                                return obj.value;
                            })
                        }
                    ]
                });
                scope.$watch("items", function (newValue) {
                    chart.series[0].setData(newValue, true);
                }, true);

            }
        }
    });
