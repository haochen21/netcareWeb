angular.module('uiNavMenu', [])
    .constant('uiNavMenuEvent', {
        clickMenuItem: 'uiNavMenu_click_menuItem'
    })
    .directive('uiNavMenu', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                menus: '=source'
            },
            template: '<ul><menu ng-repeat="menu in menus" menu="menu"></menu></ul>'
        }
    })
    .directive('menu', function ($compile,uiNavMenuEvent) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                menu: '=menu'
            },
            template: '<li ng-click="openSubMenu($event,menu)">'
                        +'<a href="" ng-class="{\'main-menu-parent\' : menu.children}">'
                          +'<i ng-show="menu.icon" class="{{menu.icon}}"></i>'
                          +'<span class="menu-text">{{menu.name}}</span>'
                          +'<b ng-show="menu.children" class="arrow fa fa-angle-down"></b>'
                        +'</a>'
                      +'</li>',
            link: function (scope, $element, attrs) {
                if (angular.isArray(scope.menu.children)) {
                    $compile('<ui-nav-menu class="main-submenu" source="menu.children" ng-style="{\'display\': displaySubMenu}"></ui-nav-menu>')(scope, function(cloned, scope){
                        $element.append(cloned);
                    });
                }

                scope.displaySubMenu = 'none';

                scope.openSubMenu = function($event,menu){
                    $event.stopPropagation();
                    if(menu.children){
                        scope.closeAllSubMenu();
                        if(scope.displaySubMenu === 'none'){
                            scope.displaySubMenu = 'block';
                        }else{
                            scope.displaySubMenu = 'none';
                        }
                    }else{
                        scope.$emit(uiNavMenuEvent.clickMenuItem,menu);
                    }
                }

                scope.closeAllSubMenu = function(){
                    //find parent
                    var parent = $element.parent();
                    //find ul
                    var ulItems = parent.find('ul');
                    for(var i=0;i<ulItems.length;i++){
                        var $ulItem = ulItems.eq(i);
                        var $liParent = $ulItem.parent();
                        if($liParent[0] != $element[0]){
                            $ulItem.scope().displaySubMenu = 'none';
                        }
                    }
                }
            }
        }
    });