(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 使用优惠券
         */
        $stateProvider.state("main.chooseCoupon", {
            url: '/chooseCoupon?s&orderId',
            views: {
                "@": {
                    templateUrl: 'views/main/chooseCoupon/index.root.html',
                    controller: chooseController
                }
            }
        });
    }]);
    chooseController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'alertService'];
    function chooseController($scope, $http, $state, $httpParamSerializer, appConfig, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.status = $state.params.s;
        // 判断获取地址是从哪个入口进来的，返回不同的入口。暂时未使用到，该接口目前只有订单中转入
        if ($scope.status) {
            // 订单详情更改入口，跳转后返回
            $scope.orderShow = true;
        } else {
            $scope.couponShow = true;
        }
        $scope.tokenImg = appConfig.tokenImg;
        //刷新验证码
        $scope.refresh = function () {
            var date = new Date().getTime();
            $scope.tokenImg = appConfig.tokenImg + "?s=" + date;
        };
        $scope.isCouponExchange = false;
        // 显示兑换优惠券
        $scope.couponExchange = function () {
            $scope.isCouponExchange = !$scope.isCouponExchange;
        };
        //显示验证码图片
        //默认不显示
        $scope.codeShow = false;
        $scope.showCode = function () {
            $scope.codeShow = true;
        };

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.orderId = $state.params.orderId;
        if (!$scope.orderId) {
            $scope.fallbackPage();
            return null;
        }
        // 如果服务中没有存在当前值，返回购物车。
        // 使用其他的优惠卷
        $scope.updateCouponOrder = function (coupon) {
            var url = "/unionOrder";
            if ($scope.status === 'qhOrder') {
                url = "/qhOrder";
            }
            // 将选择的优惠卷进行整理
            $http({
                method: "POST",
                url: appConfig.apiPath + url + '/useCoupon',
                data: $httpParamSerializer({
                    orderId: $scope.orderId,
                    couponId: coupon.couponId,
                    status: $scope.status
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                // 加上原来使用优惠卷的价格,在减去最新的
                $scope.fallbackPage();
            },function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });

        }
        ;
        // 使用优惠卷号码兑换完立即使用
        $scope.createCouponOrder = function () {
            if (!$scope.chooseCode) {
                alertService.msgAlert("exclamation-circle", "请输入兑换码");
                return;
            }

            $scope.refresh();
            var url = "/unionOrder";
            if ($scope.status === 'qhOrder') {
                url = "/qhOrder";
            }

            // 将选择的优惠卷进行整理
            $http({
                method: "POST",
                url: appConfig.apiPath + url + '/useCoupon',
                data: $httpParamSerializer({
                    orderId: $scope.orderId,
                    code: $scope.chooseCode,
                    //picCode: $scope.assets.check, //传验证码过去
                    status: $scope.status
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $scope.fallbackPage();
                $scope.codeShow = false;
                getList();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
                getList();
            });
        };
        // not 未使用的价格合适的。可以使用。overdue 未使用。但是价格不符合最低要求
        $scope.vsChange = {not: true, overdue: false};
        $scope.clickChange = function (status) {
            if (status === 1) {
                $scope.vsChange = {not: true, overdue: false};
            } else {
                $scope.vsChange = {not: false, overdue: true};
            }
        };
        var url = "/unionOrder";
        if ($scope.status === 'qhOrder') {
            url = "/qhOrder";
        }
        /**
         * 获取优惠券列表信息
         */
        function getList() {
            // 获取优惠券数据
            $http
                .get(appConfig.apiPath + url + '/chooseCoupon?orderId=' + $scope.orderId + "&status=" + $scope.status)
                .success(function (data) {
                    $scope.chooseCoupon = data;
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        }

        getList();
    }
})();
