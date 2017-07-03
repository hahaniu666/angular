(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.cancleOrder", {
                url: "/cancleOrder?id&skuId",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/cancleOrder/index.root.html',
                        controller: cancleOrderController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    cancleOrderController.$inject = ['$http', '$state', 'appConfig'];
    function cancleOrderController($http, $state, appConfig) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        vm.orderId = $state.params.id;
        vm.skuId = $state.params.skuId;
        vm.update = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/orgRefund/cancel",
                data: {
                    orderId: vm.orderId,
                    reason: vm.reason,
                    memo: vm.memo
                }
            }).then(function () {

                }, function () {

                }
            );
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
})
();