/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.confirm", {
                url: "/confirm",
                views: {
                    "@": {
                        templateUrl: 'biz/confirm/confirm.html',
                        controller: confirmController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            confirmController.$inject = ['$scope', '$http', '$state'];
            function confirmController($scope, $http, $state, $element) {
            }

        }]);


})();