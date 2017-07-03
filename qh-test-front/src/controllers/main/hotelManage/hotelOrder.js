(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelOrder", {
                url: "/hotelOrder?type&status&tableIndex",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelOrder/index.root.html',
                        controller: hotelManageOrderController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelManageOrderController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', "imgService"];
    function hotelManageOrderController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService) {
        var vm = this;
        vm.data = {
            ALL: {
                SALE: {},
                BUY: {}
            },
            UNPAYED: {
                SALE: {},
                BUY: {}
            },
            /* PAYED: {
             SALE: {},
             BUY: {}
             },*/
            UNSHIPPED: {
                SALE: {},
                BUY: {}
            },
            UNRECEIVED: {
                SALE: {},
                BUY: {}
            }
        };
        vm.status = $state.params.status ? $state.params.status : "ALL";
        vm.type = $state.params.type ? $state.params.type : "SALE";
        vm.tableIndex = $state.params.tableIndex ? $state.params.tableIndex : "0";
        vm.itemImg = imgService.itemImg;
        vm.appConfig = appConfig;
        vm.pageSize = appConfig.pageSize;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        vm.tab = $state.params.type ? $state.params.type : "SALE";
        vm.tabs = function (type, status, tableIndex) {
            vm.tab = type;
            vm.type = type;
            vm.status = status;
            vm.tableIndex = tableIndex;

            if (!vm.data[vm.status][vm.type].items) {
                vm.data[vm.status][vm.type].items = [];
                vm.getOrder();
            }
        };

        vm.getOrder = function () {
            if (!vm.data[vm.status][vm.type].curPage) {
                vm.data[vm.status][vm.type].curPage = 1;
            }

            $http({
                method: "GET",
                url: appConfig.apiPath + "/managerOrder/order",
                params: {
                    pageSize: appConfig.pageSize,
                    curPage: vm.data[vm.status][vm.type].curPage,
                    status: vm.status === "ALL" ? '' : vm.status,
                    type: vm.type
                }
            }).then(function (resp) {
                    if (resp.data.code === 'SUCCESS') {
                        if (!vm.data[vm.status][vm.type].items) {
                            vm.data[vm.status][vm.type].items = [];
                        }
                        vm.data[vm.status][vm.type].items = vm.data[vm.status][vm.type].items.concat(resp.data.items);
                        vm.data[vm.status][vm.type].totalCount = resp.data.totalCount;
                        vm.data[vm.status][vm.type].curPage = resp.data.curPage;
                        if (resp.data.curPage * resp.data.pageSize >= resp.data.totalCount) {
                            vm.data[vm.status][vm.type].pageEnd = true;
                        }
                        vm.data[vm.status][vm.type].curPage++;
                    }
                }, function () {

                }
            );
        };


        /*仓库调货*/
        vm.getAllocation = function (id) {
            alertService.confirm(null, "", "确定申请调拨？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/allocation',
                        data: $httpParamSerializer({
                            orderId: id,
                            memo: ''
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.data[vm.status][vm.type] = {};
                        vm.getOrder();
                    });
                }
            });
        };


        /*现货发售*/
        vm.sellDelivery = function (id) {
            alertService.confirm(null, "", "确定现货发售？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/delivery',
                        data: $httpParamSerializer({
                            orderId: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.data[vm.status][vm.type] = {};
                        vm.getOrder();
                    });
                }
            });

        };
        //取消调拨
        vm.cancelAllocation = function (id) {
            alertService.confirm(null, "", "确定取消调拨？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/allocationCancel',
                        data: $httpParamSerializer({
                            id: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.data[vm.status][vm.type] = {};
                        vm.getOrder();
                    });
                }
            });
        };

        //调拨收货
        vm.finnishAllocation = function (id) {
            alertService.confirm(null, "", "确定调拨收货？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/allocationFinished',
                        data: $httpParamSerializer({
                            id: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.data[vm.status][vm.type] = {};
                        vm.getOrder();
                    });
                }
            });
        };

        /*确认收货*/
        vm.checkReceipt = function (id) {
            alertService.confirm(null, "", "确认收货？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/confirm',
                        data: $httpParamSerializer({
                            orderId: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $state.go('main.hotelManage.itemManage', {type: 'CURRENT', status: null}, {reload: true});
                    });
                }
            });
        };

        /**
         * 拒绝接单
         */
        vm.reject = function (id) {
            alertService.confirm(null, "", "拒绝接单？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/managerOrder/refused',
                        data: $httpParamSerializer({
                            id: id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        vm.data[vm.status][vm.type] = {};
                        vm.getOrder();
                    });
                }
            });
        };

        vm.tabs(vm.type, vm.status, vm.tableIndex);

        // 回退页面
        vm.fallbackPage = function () {
            $state.go("main.hotelManage", null, {reload: true});
        };
    }
})();