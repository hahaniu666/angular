/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.applyMaintenance", {
                url: "/applyMaintenance",
                views: {
                    "@": {
                        templateUrl: 'biz/applyMaintenance/applyMaintenance.html',
                        controller: applyMaintenanceController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            applyMaintenanceController.$inject = ['$scope', '$http', '$state'];
            function applyMaintenanceController($scope, $http, $state, $element) {
            }

        }]);

})();