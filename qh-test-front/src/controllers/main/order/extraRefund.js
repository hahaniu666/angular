(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 补差价订单详情
         */
        $stateProvider.state("main.order.extraRefund", {
            url: '/extraRefund?orderId',
            views: {
                "@": {
                    templateUrl: 'views/main/order/extraRefund/index.root.html',
                    controller: extraDetailControll
                }
            }
        });
    }]);
    extraDetailControll.$inject = ['$timeout', '$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'imgService', "alertService"];
    function extraDetailControll($timeout, $scope, $http, $state, $httpParamSerializer, appConfig, imgService, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        $scope.imgUrl = appConfig.imgUrl;

        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        // 当前订单的购买数量
        if (!$state.params.orderId) {
            // 参数未传完整,直接跳回我的订单处
            $scope.fallbackPage();
            return;
        }
        ////////////////// 获取订单的详细信息
        $http({
            method: 'GET',
            url: appConfig.apiPath + '/unionOrder/restitution?orderId=' + $state.params.orderId
        }).then(function (resp) {
            var data = resp.data;
            $scope.order = data.result;
            $scope.maxPrice = $scope.order.totalPrice / 100;
        }, function () {
        });
        $scope.refund = {};
        // 校验每次输入的价格
        $scope.requirePrice = function () {
            if (!$scope.refund.price) {
                $scope.refund.price = "";
            }
            if (isNaN($scope.refund.price)) {
                $scope.refund.price = "";
                return;
            }
            if ($scope.refund.price < 0) {
                $scope.refund.price = 0;
            } else if ($scope.refund.price > $scope.maxPrice) {
                $scope.refund.price = $scope.maxPrice;
            }
        };

        $scope.orderRefund = function () {
            if ($scope.refund.price === 0) {
                // 为0时未被计算入内
            } else {
                if (!$scope.refund.price || isNaN($scope.refund.price)) {
                    alertService.msgAlert("exclamation-circle", "请填写正确的金额");
                    return;
                }
                if ($scope.refund.price < 0 || $scope.refund.price > $scope.maxPrice) {
                    alertService.msgAlert("exclamation-circle", "请填写正确的金额");
                    return;
                }
            }
            // 将价格转为分传入
            $scope.maxBranchPrice = $scope.refund.price * 100;
            /*alertService.confirm(null, "确认提交并返回等待员工审核", "")*/
            alertService.confirm(null, "", "确认提交并返回等待员工审核?", "取消", "确定").then(function (data) {
                if (data) {
                    // 申请退货,
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/unionOrder/restitutionRefund',
                        data: $httpParamSerializer({
                            id: $scope.order.id,
                            reason: "补差价退款",
                            price: $scope.maxBranchPrice,
                            memo: $scope.refund.memo
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $scope.fallbackPage();
                    })
                }
            });
        };
    }
})();