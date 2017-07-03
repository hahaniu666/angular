/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.loginPassword", {
                url: "/loginPassword",
                views: {
                    "@": {
                        templateUrl: 'biz/loginPassword/loginPassword.html',
                        controller: loginPasswordController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    loginPasswordController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function loginPasswordController($scope,$mdBottomSheet,$mdToast) {

    };


})();