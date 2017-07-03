/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.twoCode", {
                url: "/twoCode",
                views: {
                    "@": {
                        templateUrl: 'biz/twoCode/twoCode.html',
                        controller: TwoCodeController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    TwoCodeController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function TwoCodeController($scope,$mdBottomSheet,$mdToast) {

    };


})();