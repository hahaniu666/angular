(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.manageOrderDetail", {
                url: "/manageOrderDetail?id&type&status&tableIndex",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/manageOrderDetail/index.root.html',
                        controller: manageOrderDetailController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    manageOrderDetailController.$inject = ['$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer'];
    function manageOrderDetailController($http, $state, appConfig, alertService, $httpParamSerializer) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        vm.tab = 1;
        vm.tabs = function (num) {
            vm.tab = num;
        };

        vm.orderId = $state.params.id;
        vm.fromType = $state.params.type;
        vm.fromStatus = $state.params.status;
        vm.tableIndex = $state.params.tableIndex;

        vm.getDetail = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/orgOrder/detail",
                params: {
                    orderId: vm.orderId
                }
            }).then(function (resp) {
                    vm.data = resp.data.result;
                }, function () {
                }
            );
        };
        vm.getDetail();

        vm.pay = function () {

            $http({
                method: "POST",
                url: appConfig.apiPath + "/orgOrder/qhPay",
                data: $httpParamSerializer({
                    orderId: vm.orderId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    vm.qhPayId = resp.data.qhPayId;
                    $state.go("main.pay", {
                        payId: vm.qhPayId,
                        s: "main.hotelManage.hotelOrder",
                        param: angular.toJson({
                            type: 'BUY',
                            status: 'ALL'
                        })
                    });
                }, function () {
                }
            );
        };


        /*仓库调货*/
        vm.getAllocation = function () {
            alertService.confirm(null, "", "确定仓库调货？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/allocation',
                        data: $httpParamSerializer({
                            orderId: vm.orderId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.getDetail();
                    });
                }
            });
        };


        /*现货发售*/
        vm.sellDelivery = function () {
            alertService.confirm(null, "", "确定现货发售？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/delivery',
                        data: $httpParamSerializer({
                            orderId: vm.orderId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.getDetail();
                    });
                }
            });

        };


        /*确认收货*/
        vm.receive = function () {
            alertService.confirm(null, "", "确认收货？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/confirm',
                        data: $httpParamSerializer({
                            orderId: vm.orderId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.getDetail();
                    });
                }
            });
        };

        /**
         * 拒绝接单
         */
        vm.reject = function () {
            alertService.confirm(null, "", "拒绝接单？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/refused',
                        data: $httpParamSerializer({
                            id: vm.orderId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.getDetail();
                    });
                }
            });
        };


        // 回退页面
        vm.fallbackPage = function () {
            if (vm.fromType || vm.fromStatus || vm.tableIndex) {
                $state.go("main.hotelManage.hotelOrder", {
                    type: vm.fromType,
                    status: vm.fromStatus,
                    tableIndex: vm.tableIndex
                }, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();