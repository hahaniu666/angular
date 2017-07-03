/**
 * Module : Coupon
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.Coupon", {
                url: "/Coupon",
                views: {
                    "@": {
                        templateUrl: 'biz/Coupon/Coupon.html',
                        controller: CouponController
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    CouponController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function CouponController($scope, $http, $state, $element, $rootScope) {
    }
})();