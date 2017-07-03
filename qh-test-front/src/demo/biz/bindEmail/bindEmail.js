/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.bindEmail", {
                url: "/bindEmail",
                views: {
                    "@": {
                        templateUrl: 'biz/bindEmail/bindEmail.html',
                        controller: bindEmailController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    bindEmailController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function bindEmailController($scope,$mdBottomSheet,$mdToast) {

    };


})();