/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.returnRefund", {
                url: "/returnRefund",
                views: {
                    "@": {
                        templateUrl: 'biz/returnRefund/returnRefund.html',
                        controller: returnRefundController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            returnRefundController.$inject = ['$scope', '$http', '$state'];
            function returnRefundController($scope, $http, $state, $element) {
            }

        }]);

})();