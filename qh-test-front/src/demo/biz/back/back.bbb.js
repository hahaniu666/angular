/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.back.bbb", {
                url: "/bbb",
                views: {
                    "@": {
                        templateUrl: 'biz/back/back.bbb.html',
                        controller: BackBbbController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            BackBbbController.$inject = ['$scope', '$state'];
            function BackBbbController($scope, $state) {
            }

        }]);


})();