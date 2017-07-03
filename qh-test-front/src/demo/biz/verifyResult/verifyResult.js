/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.verifyResult", {
                url: "/verifyResult",
                views: {
                    "@": {
                        templateUrl: 'biz/verifyResult/verifyResult.html',
                        controller: VerifyResultController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    VerifyResultController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function VerifyResultController($scope,$mdBottomSheet,$mdToast) {

    };


})();