(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.filterRecord", {
                url: "/filterRecord",
                views: {
                    "@": {
                        templateUrl: 'biz/filterRecord/filterRecord.html',
                        controller: filterRecordController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    filterRecordController.$inject = ['$scope'];
    function filterRecordController($scope) {
    }
})();