/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.bindTelNum", {
                url: "/bindTelNum",
                views: {
                    "@": {
                        templateUrl: 'biz/bindTelNum/bindTelNum.html',
                        controller: bindTelNumController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    bindTelNumController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function bindTelNumController($scope,$mdBottomSheet,$mdToast) {

    };


})();