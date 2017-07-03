/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.shippingAddress", {
                url: "/shippingAddress",
                views: {
                    "@": {
                        templateUrl: 'biz/shippingAddress/shippingAddress.html',
                        controller: ShippingAddressController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    ShippingAddressController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function ShippingAddressController($scope,$mdBottomSheet,$mdToast) {

    };


})();