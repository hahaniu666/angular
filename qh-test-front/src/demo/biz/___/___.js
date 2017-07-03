/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.xxx", {
                url: "/xxx",
                views: {
                    "@": {
                        templateUrl: 'biz/___/___.html',
                        controller: xxxController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    xxxController.$inject = ['$scope'];
    function xxxController($scope) {
    }
})();