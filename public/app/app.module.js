angular.module('netcareApp',['ngResource','ngRoute','ngAnimate','uiNavMenu',
    'uiCheckbox','ngFootable', 'ngFootablePagination','ngHighchart','ui.select','pdf'])
    .config(function (socketServiceProvider) {
        socketServiceProvider.init();
    });