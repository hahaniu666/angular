(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelRefund", {
                url: "/hotelRefund?id&skuId&price",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelRefund/index.root.html',
                        controller: hotelRefundController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelRefundController.$inject = [ '$http', '$state', 'appConfig', 'alertService'];
    function hotelRefundController($http, $state, appConfig, alertService) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        vm.orderId = $state.params.id;
        vm.skuId = $state.params.skuId;
        vm.price = $state.params.price / 100;
        vm.type = "ORGORDER";
        vm.patterns = 0;
        vm.refundType = [{
            name: '退货退款',
            value: 'ORGORDER_SKU'
        }, {
            name: '仅退款',
            value: 'ORGORDER'
        }];
        /**
         * 服务类型改变
         */
        vm.changeType = function () {
            if (vm.type === "ORGORDER") {
                vm.patterns = 0;
            } else if (vm.type === "ORGORDER_SKU") {
                vm.patterns = 1;
            }
        };

        /*退款*/
        vm.update = function () {
            alertService.confirm(null, "", "提交后，等待平台员工审核！", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + "/orgRefund/refund",
                        data: {
                            orderId: vm.orderId,
                            skuId: vm.skuId,
                            reason: vm.reason,
                            memo: vm.memo,
                            type: vm.type,
                            price: vm.price
                        }
                    }).then(function () {
                            vm.fallbackPage();
                        }, function () {

                        }
                    );
                }
            });
        };


        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();