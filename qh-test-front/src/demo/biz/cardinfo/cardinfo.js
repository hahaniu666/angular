/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.cardinfo", {
                url: "/cardinfo",
                views: {
                    "@": {
                        templateUrl: 'biz/cardinfo/cardinfo.html',
                        controller: cardinfoController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    cardinfoController.$inject = ['$scope'];
    function cardinfoController($scope) {
    }
})();