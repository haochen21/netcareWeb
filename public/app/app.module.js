angular.module('netcareApp',['ngResource','ngRoute','ngTouch','uiNavMenu',
    'uiCheckbox','ngFootable', 'ngFootablePagination','ngHighchart','ui.select','pdf','ui.bootstrap'])
    .config(function (socketServiceProvider) {
        socketServiceProvider.init();
    });