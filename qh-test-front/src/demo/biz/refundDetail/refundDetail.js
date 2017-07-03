/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.refundDetail", {
                url: "/refundDetail",
                views: {
                    "@": {
                        templateUrl: 'biz/refundDetail/refundDetail.html',
                        controller: refundDetailController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            refundDetailController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function refundDetailController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();