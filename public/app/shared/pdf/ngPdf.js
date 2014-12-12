angular.module('pdf', [])
    .directive('ngPdf', ['$window','$document', function ($window,$document) {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div class="pdfViewContainer">'
                +'<nav class="pdfViewToolbar">'
                +'<button ng-click="goPrevious()"><span>pre</span></button>'
                +'<button ng-click="goNext()"><span>next</span></button>'
                +'<button ng-click="zoomIn()"><span>in</span></button>'
                +'<button ng-click="zoomOut()"><span>out</span></button>'
                +'<button ng-click="rotate()"><span>90</span></button>'
                +'<span>Page: </span>'
                +'<input type="text" min=1 ng-model="pageToDisplay">'
                +'<span> / {{numPages}}</span>'
                +'</nav>'
                +'</div>',
            link: function (scope, element, attrs) {
                var url = scope.pdfUrl,
                    pdfDoc = null,
                    currPage = 1,
                    scale = (attrs.scale ? attrs.scale : 1);

                scope.pageToDisplay = 1;
                scope.numPages = 1;

                PDFJS.disableWorker = true;
                PDFJS.getDocument(url).then(function (_pdfDoc) {
                    pdfDoc = _pdfDoc;
                    scope.numPages = _pdfDoc.numPages;

                    //Start with first page
                    _pdfDoc.getPage(1).then(scope.handlePages);
                });

                var $pdfViewer = angular.element('<div class="pdfViewer"></div>');
                element.append($pdfViewer);

                scope.handlePages = function (page) {

                    var $aElement = angular.element('<a></a>');
                    $aElement.attr('id','pdfView'+currPage);

                    $pdfViewer.append($aElement);

                    //This gives us the page's dimensions at full scale
                    var viewport = page.getViewport(scale);

                    //We'll create a canvas for each page to draw it on
                    var canvas = $document[0].createElement("canvas");
                    canvas.style.display = "block";
                    canvas.className = 'pdfCanvas';
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    //Draw it on the canvas
                    page.render({canvasContext: context, viewport: viewport});

                    //Add it to the web page
                    $pdfViewer.append(angular.element(canvas));

                    //Move to next page
                    currPage++;
                    if (pdfDoc !== null && currPage <= scope.numPages) {
                        pdfDoc.getPage(currPage).then(scope.handlePages);
                    }
                };

                scope.goPrevious = function() {
                    if (scope.pageToDisplay <= 1) {
                        return;
                    }
                    scope.pageToDisplay = scope.pageToDisplay - 1;
                    scope.scrollTo();
                };

                scope.goNext = function() {
                    if (scope.pageToDisplay >= scope.numPages) {
                        return;
                    }
                    scope.pageToDisplay = scope.pageToDisplay + 1;
                    scope.scrollTo();
                };

                scope.scrollTo = function() {
                    var aItems = element.find('a');
                    for(var i=0;i<aItems.length;i++){
                        var $aItem = aItems.eq(i);
                        var pageName = $aItem.attr('id');
                        if('pdfView'+scope.pageToDisplay === pageName){
                            var location = $aItem[0].offsetTop - 10;
                            console.log(location);
                            $window.scrollTo(0, location);
                            break;
                        }
                    }
                };

                scope.zoomOut = function() {
                    scale = parseFloat(scale) + 0.2;
                    $pdfViewer.empty();
                    currPage = 1;
                    pdfDoc.getPage(1).then(scope.handlePages);
                };

                scope.zoomIn = function() {
                    scale = parseFloat(scale) - 0.2;
                    $pdfViewer.empty();
                    currPage = 1;
                    pdfDoc.getPage(1).then(scope.handlePages);
                };
            }
        }
    }]);
