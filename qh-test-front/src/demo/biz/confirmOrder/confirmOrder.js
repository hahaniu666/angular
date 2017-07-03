/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.confirmOrder", {
                url: "/confirmOrder",
                views: {
                    "@": {
                        templateUrl: 'biz/confirmOrder/confirmOrder.html',
                        controller: ConfirmOrderController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            ConfirmOrderController.$inject = ['$scope', '$http', '$state'];
            function ConfirmOrderController($scope, $http, $state) {

                $scope.orderItems = new Array(3);
            }

        }]);
})();