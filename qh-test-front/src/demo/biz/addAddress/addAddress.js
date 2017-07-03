/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.addAddress", {
                url: "/addAddress",
                views: {
                    "@": {
                        templateUrl: 'biz/addAddress/addAddress.html',
                        controller: addAddressController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    addAddressController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function addAddressController($scope,$mdBottomSheet,$mdToast) {

    };


})();

