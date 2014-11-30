angular.module('netcareApp')
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when("/components/login", {
            templateUrl: "app/components/login/loginView.html"
        });

        $routeProvider.when("/components/portal", {
            templateUrl: "app/components/portal/portalView.html"
        });

        $routeProvider.when("/components/customerTopo", {
            templateUrl: "app/components/customerTopo/customerTopoView.html"
        });

        $routeProvider.when("/components/bizFault", {
            templateUrl: "app/components/bizFault/bizFaultView.html"
        });

        $routeProvider.when("/components/circuitMgmt", {
            templateUrl: "app/components/circuitMgmt/circuitMgmtView.html"
        });

        $routeProvider.otherwise({
            templateUrl: "app/components/login/loginView.html"
        });
    });