(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 兑换优惠券信息
         */
        $stateProvider.state("main.myAssets.coupons.exchange", {
            url: "/exchange?s",

            views: {
                "@": {
                    templateUrl: 'views/main/myAssets/coupons/exchange/index.root.html',
                    controller: exchangeController
                }
            }
        });
    }]);
    exchangeController.$inject = ['$scope', '$http', '$httpParamSerializer', '$state', 'appConfig', "alertService"];
    function exchangeController($scope, $http, $httpParamSerializer, $state, appConfig, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.status = $state.params.s;
        var date = new Date().getTime();
        $scope.tokenImg = appConfig.tokenImg + "?s=" + date;
        $scope.assets = {code: null, check: null};
        // 兑换优惠券
        $scope.exchange = function () {
            if (!$scope.assets.code || !$scope.assets.check) {
                alertService.msgAlert("exclamation-circle", "输入完整数据");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/coupon/exchange',
                data: $httpParamSerializer($scope.assets),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})
                $scope.fallbackPage();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                    return;
                }
                var date = new Date().getTime();
                $scope.tokenImg = appConfig.tokenImg + "?s=" + date;
            });
        };
        //刷新验证码
        $scope.refreshImg = function () {
            var date = new Date().getTime();
            $scope.tokenImg = appConfig.tokenImg + "?s=" + date;
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