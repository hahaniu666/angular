/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.payPassword", {
                url: "/payPassword",
                views: {
                    "@": {
                        templateUrl: 'biz/payPassword/payPassword.html',
                        controller: payPasswordController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    payPasswordController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function payPasswordController($scope,$mdBottomSheet,$mdToast) {

    };


})();