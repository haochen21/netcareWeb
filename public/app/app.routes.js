angular.module('netcareApp')
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when("/portal", {
            templateUrl: "app/components/portal/portalView.html"
        });
        $routeProvider.when("/customerTopo", {
            templateUrl: "app/components/customerTopo/customerTopoView.html"
        });
        $routeProvider.when("/bizFault", {
            templateUrl: "app/components/bizFault/bizFaultView.html"
        });

        $routeProvider.otherwise({
            templateUrl: "app/components/portal/portalView.html"
        });
    })