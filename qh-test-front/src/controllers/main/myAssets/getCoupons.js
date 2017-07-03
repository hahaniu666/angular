(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 领取优惠券
         */
        $stateProvider.state("main.myAssets.getCoupons", {
            url: "/getCoupons",
            views: {
                "@": {
                    templateUrl: 'views/main/myAssets/getCoupons/index.root.html',
                    controller: getcoupController
                }
            }
        });
    }]);
    getcoupController.$inject=[ 'alertService', '$scope', '$http', 'appConfig', "$state"];
    function getcoupController( alertService, $scope, $http, appConfig, $state) {
        ////返回顶部
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.noCouponsshow = false; //默认不显示
        $scope.queryGetCoupon = function (curPage) {
            $http
                .get(appConfig.apiPath + '/coupon/couponList?curPage=' + curPage + "&pageSize=" + $scope.pageSize)
                .success(function (data) {
                    $scope.getCoupons = data;
                    if ($scope.getCoupons.coupons.length === 0) {
                        $scope.noCouponsshow = true;
                    } else {
                        $scope.noCouponsshow = false;
                    }
                    for (var i = 0; i < $scope.getCoupons.coupons.length; i++) {
                        if ($scope.getCoupons.coupons[i].getAlready) {
                            $scope.getCoupons.coupons[i].name = "已领取";

                        } else {
                            $scope.getCoupons.coupons[i].name = "领取";
                        }
                    }
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        //加载第一页
        $scope.queryGetCoupon(1);

        //可领取优惠券翻页
        $scope.getPageChanged = function () {
            $http
                .get(appConfig.apiPath + '/coupon/couponList?curPage=' + $scope.getCoupons.curPage + "&pageSize=" + $scope.pageSize)
                .success(function (data) {
                    $scope.getCoupons = data;
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        //领取优惠券
        $scope.ReceiveCoupons = function (getCoupon) {
            $http
                .get(appConfig.apiPath + '/coupon/getCoupon?id=' + getCoupon.id)
                .success(function () {
                    alertService.msgAlert("success", "您已成功领取！");
                    getCoupon.name = "已领取";
                    getCoupon.getAlready = true;
                    $scope.queryGetCoupon(1);
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        //返回按钮
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();