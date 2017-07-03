/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.refund", {
                url: "/refund",
                views: {
                    "@": {
                        templateUrl: 'biz/refund/refund.html',
                        controller: refundController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            refundController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function refundController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();