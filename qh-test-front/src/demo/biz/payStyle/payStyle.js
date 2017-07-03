/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.payStyle", {
                url: "/payStyle",
                views: {
                    "@": {
                        templateUrl: 'biz/payStyle/payStyle.html',
                        controller: payStyleController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            payStyleController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function payStyleController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();