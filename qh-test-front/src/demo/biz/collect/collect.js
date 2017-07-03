/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.collect", {
                url: "/collect",
                views: {
                    "@": {
                        templateUrl: 'biz/collect/collect.html',
                        controller: collectController
                    }
                }
            });

            // ----------------------------------------------------------------------------
             collectController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function  collectController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();