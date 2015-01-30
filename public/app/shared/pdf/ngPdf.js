angular.module('pdf', [])
    .directive('ngPdf', ['$window', '$document','$timeout', function ($window, $document,$timeout) {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/shared/pdf/ngPdfView.html',
            scope: {
                pdfUrl: '=',
                onGoBack: '&',
                onDownload: '&'
            },
            link: function (scope, element, attrs) {
                var url = scope.pdfUrl,
                    pdfDoc = null,
                    currPage = 1,
                    autoScroll = false;
                    scale = 1;

                scope.getViewportWidth = function () {
                    return $window.innerWidth || ($document.body ? $document.body.offsetWidth : 0);
                };

                if (scope.getViewportWidth() <= 768) {
                    scale = 0.7;
                } else {
                    scale = 1.5;
                }

                scope.pageToDisplay = 1;
                scope.numPages = 1;

                PDFJS.disableWorker = true;
                PDFJS.getDocument(url).then(function (_pdfDoc) {
                    pdfDoc = _pdfDoc;
                    scope.$apply(function () {
                        scope.numPages = _pdfDoc.numPages;
                    });
                    //Start with first page
                    _pdfDoc.getPage(1).then(scope.handlePages);
                });

                angular.element($window).bind("scroll", scope.windowScroll);

                scope.windowScroll = function(){
                    var aItems = $pdfViewer.find('a');
                    for (var i = 0; i < aItems.length; i++) {
                        var location = aItems.eq(i)[0].offsetTop;
                        var nextLocation;
                        if (i + 1 >= aItems.length){
                            nextLocation = location+100;
                        }else{
                            nextLocation = aItems.eq(i + 1)[0].offsetTop;
                        }
                        if (($window.pageYOffset === 0 || $window.pageYOffset > location)
                            && $window.pageYOffset < nextLocation) {
                            scope.$apply(function () {
                                scope.pageToDisplay = i + 1;
                            });
                            break;
                        }
                    }
                };

                var $pdfViewer = angular.element('<div class="pdfViewer"></div>');
                element.append($pdfViewer);

                scope.handlePages = function (page) {
                    var $aElement = angular.element('<a></a>');
                    $aElement.attr('id', 'pdfView' + currPage);

                    $pdfViewer.append($aElement);

                    //This gives us the page's dimensions at full scale
                    var viewport = page.getViewport(scale);

                    //We'll create a canvas for each page to draw it on
                    var canvas = $document[0].createElement("canvas");
                    canvas.style.display = "block";
                    canvas.className = 'pdfCanvas rotate0';
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    //Draw it on the canvas
                    page.render({canvasContext: context, viewport: viewport});

                    //Add it to the web page
                    $pdfViewer.append(angular.element(canvas));

                    if( scope.pageToDisplay === currPage){
                        scope.scrollTo();
                    }

                    //Move to next page
                    currPage++;
                    if (pdfDoc !== null && currPage <= scope.numPages) {
                        pdfDoc.getPage(currPage).then(scope.handlePages);
                    }
                };

                scope.goPrevious = function () {
                    if (scope.pageToDisplay <= 1) {
                        return;
                    }
                    scope.pageToDisplay = scope.pageToDisplay - 1;
                    scope.scrollTo();
                };

                scope.goNext = function () {
                    if (scope.pageToDisplay >= scope.numPages) {
                        return;
                    }
                    scope.pageToDisplay = scope.pageToDisplay + 1;
                    scope.scrollTo();
                };

                scope.scrollTo = function () {
                    angular.element($window).unbind('scroll',scope.windowScroll);
                    console.log('pageToDisplay:'+scope.pageToDisplay);
                    var aItems = $pdfViewer.find('a');
                    for (var i = 0; i < aItems.length; i++) {
                        var $aItem = aItems.eq(i);
                        var pageName = $aItem.attr('id');
                        if ('pdfView' + scope.pageToDisplay === pageName) {
                            var location = $aItem[0].offsetTop - 10;
                            $window.scrollTo(0, location);
                            break;
                        }
                    }
                    $timeout(function () {
                        angular.element($window).bind('scroll',scope.windowScroll);
                    },0);
                };

                scope.zoomOut = function () {
                    scale = parseFloat(scale) + 0.2;
                    $pdfViewer.empty();
                    currPage = 1;
                    pdfDoc.getPage(1).then(scope.handlePages);
                };

                scope.zoomIn = function () {
                    scale = parseFloat(scale) - 0.2;
                    $pdfViewer.empty();
                    currPage = 1;
                    pdfDoc.getPage(1).then(scope.handlePages);
                };

                scope.rotate = function () {
                    var canvasElements = element.find('canvas');
                    for (var i = 0; i < canvasElements.length; i++) {
                        var $canvas = canvasElements.eq(i);
                        if ($canvas.hasClass('rotate0')) {
                            $canvas.removeClass('rotate0');
                            $canvas.addClass('rotate90');
                        } else if ($canvas.hasClass('rotate90')) {
                            $canvas.removeClass('rotate90');
                            $canvas.addClass('rotate180');
                        } else if ($canvas.hasClass('rotate180')) {
                            $canvas.removeClass('rotate180');
                            $canvas.addClass('rotate270');
                        } else if ($canvas.hasClass('rotate270')) {
                            $canvas.removeClass('rotate270');
                            $canvas.addClass('rotate0');
                        }
                    }
                };

                scope.goBack = function(){
                    scope.onGoBack();
                };

                scope.download = function(){
                    scope.onDownload();
                }
            }
        }
    }]);
