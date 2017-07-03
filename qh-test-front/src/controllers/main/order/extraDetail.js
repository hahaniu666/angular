(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 补差价订单详情
         */
        $stateProvider.state("main.order.extraDetail", {
            url: '/extraDetail?orderId',
            views: {
                "@": {
                    templateUrl: 'views/main/order/extraDetail/index.root.html',
                    controller: extraDetailControll
                }
            }
        });
    }]);
    extraDetailControll.$inject = ['$scope', '$http', '$state',  'appConfig', 'imgService'];
    function extraDetailControll( $scope, $http, $state, appConfig, imgService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();

        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        ////////////////// 获取订单的详细信息
        $http({
            method: 'GET',
            url: appConfig.apiPath + '/unionOrder/restitution?orderId=' + $state.params.orderId
        }).then(function (resp) {
            var data = resp.data;
            $scope.order = data.result;
        }, function () {
        });
        // 前往付款
        $scope.orderPay = function () {
            var datas = {restitution: [$scope.order.id]};
            // 生成支付订单来
            $http({
                method: "POST",
                url: appConfig.apiPath + '/unionOrder/qhPay',
                data: datas
            }).then(function (resp) {
                $state.go("main.unionOrder.unionPay", {
                    orderId: resp.data.id,
                    s: "detail",
                    id: "$scope.order.id"
                }, {reload: true});
                // 重新计算价格（要求当前商品是选中状态）
            }, function () {
                //error
            });
        };
        $scope.fallbackPage = function () {
            $state.go("main.unionOrder", {reload: true});
        };
        $scope.refundDetail = function () {
            $state.go("main.order.extraRefund", {orderId: $scope.order.id}, {reload: true});
        };

    }
})();