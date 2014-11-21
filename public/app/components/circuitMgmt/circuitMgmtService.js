angular.module('netcareApp')
    .factory('circuitMgmtService', function() {
        var model = {};

        model.circuits = [];
        model.pagination = { };

        model.setCircuits = function(circuits){
            model.circuits = circuits;
        };

        model.setPagination = function(pagination){
            model.pagination.itemSize = pagination.itemSize;
            model.pagination.pageSize = pagination.pageSize;
            model.pagination.pageNumber = pagination.pageNumber;
            model.pagination.currentPage = pagination.currentPage;
            model.pagination.lastPage = pagination.lastPage;
        };

        return model;
    });