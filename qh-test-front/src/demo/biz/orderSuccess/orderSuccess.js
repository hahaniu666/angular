/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.orderSuccess", {
                url: "/orderSuccess",
                views: {
                    "@": {
                        templateUrl: 'biz/orderSuccess/orderSuccess.html',
                        controller: OrderSuccessController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    OrderSuccessController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function OrderSuccessController($scope,$mdBottomSheet,$mdToast) {

    };


})();