/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.receive", {
                url: "/receive",
                views: {
                    "@": {
                        templateUrl: 'biz/receive/receive.html',
                        controller: receiveController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            receiveController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function receiveController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();