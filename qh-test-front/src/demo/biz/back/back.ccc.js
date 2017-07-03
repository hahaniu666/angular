/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.back.ccc", {
                url: "/ccc",
                views: {
                    "@": {
                        templateUrl: 'biz/back/back.ccc.html',
                        controller: BackCccController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            BackCccController.$inject = ['$scope', '$state'];
            function BackCccController($scope, $state) {
            }

        }]);


})();