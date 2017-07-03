(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.receiveCoupon", {
            url: '/receiveCoupon',
            views: {
                "@": {
                    templateUrl: 'views/main/receiveCoupon/index.root.html',
                    controller:receiveController
                }
            }
        });
    }]);
    receiveController.$inject = ['$scope', '$http', '$state',  'appConfig'];
    function receiveController($scope, $http, $state, appConfig) {
            $scope.imgUrl = appConfig.imgUrl;
            $scope.notLogin = false;
            $http
                .get(appConfig.apiPath + '/common/indexCouponImg')
                .success(function (data) {
                    $scope.couponImg = data.img;
                });

            /**获取优惠券*/
            $scope.getCoupon = function () {
                $http.get(appConfig.apiPath + '/common/getNewUserCoupon')
                    .success(function () {
                        $state.go("main.useCoupon", {backUrl: window.location.href});
                    })
                    .error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
            };

            /**去登录*/
            $scope.goLogin = function () {
                $state.go("main.newLogin", {backUrl: window.location.href});
            };

            // 回退页面
            $scope.fallbackPage = function () {
                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.back();
                }
            };

        }
})();
