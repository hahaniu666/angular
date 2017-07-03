/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.bindAccounts", {
                url: "/bindAccounts",
                views: {
                    "@": {
                        templateUrl: 'biz/bindAccounts/bindAccounts.html',
                        controller: BindAccountsController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    BindAccountsController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function BindAccountsController($scope,$mdBottomSheet,$mdToast) {

    };


})();