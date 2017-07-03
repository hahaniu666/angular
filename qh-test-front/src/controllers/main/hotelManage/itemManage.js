(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.itemManage", {
                url: "/itemManage?tab",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/itemManage/index.root.html',
                        controller: itemManageOrderController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    itemManageOrderController.$inject = ['$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer'];
    function itemManageOrderController($http, $state, appConfig, alertService, $httpParamSerializer) {
        var vm = this;
        vm.data = {userOrg: "", items: []};
        vm.orgItemIds = [];
        vm.pageSize = appConfig.pageSize;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL

        vm.tab = $state.params.tab ? $state.params.tab : 1;
        vm.tableIndex = vm.tab - 1;
        vm.toggle = function (item) {
            var idx = vm.orgItemIds.indexOf(item);
            if (idx > -1) {
                vm.orgItemIds.splice(idx, 1);
            }
            else {
                vm.orgItemIds.push(item);
            }
        };

        vm.exists = function (item) {
            return vm.orgItemIds.indexOf(item) > -1;
        };

        // 回退页面
        vm.fallbackPage = function () {

            $state.go("main.hotelManage", null, {reload: true});

        };

        vm.nums = {};

        //获取数量
        vm.getNums = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/managerOrg/shopIndex"
            }).then(function (resp) {
                    if (resp.data.code === 'SUCCESS') {
                        vm.nums = resp.data;
                    }
                }, function () {

                }
            );
        };
        vm.pageEnd = false;
        vm.curPage = 0;
        /**
         * 获取商品信息
         */
        vm.getInfo = function () {
            if (!vm.pageEnd) {
                vm.curPage++;
                $http({
                    method: "GET",
                    url: appConfig.apiPath + "/managerOrg/search",
                    params: {
                        pageSize: vm.pageSize,
                        curPage: vm.curPage,
                        status: vm.status,
                        type: vm.type
                    }
                }).then(function (resp) {
                        if (resp.data.code === 'SUCCESS') {
                            //含有数据 直接添加
                            if (vm.data.items.length > 0) {
                                for (var i = 0; i < resp.data.items.length; i++) {
                                    vm.data.items.push(resp.data.items[i]);
                                }
                            } else {
                                vm.data = resp.data;
                            }

                            if (resp.data.curPage * resp.data.pageSize >= resp.data.totalCount) {
                                vm.pageEnd = true;
                            }
                        }
                    }, function () {

                    }
                );
            }
        };

        /**
         * 获取符合条件的数据
         * @param index
         */
        vm.statusQueryAll = function (index) {
            vm.pageEnd = false;
            index = parseInt(index);
            switch (index) {
                case 1:
                    //全部
                    vm.status = ['NORMAL'];
                    vm.type = "ALL";
                    break;
                case 4:
                    //现货
                    vm.status = null;
                    vm.type = "CURRENT";
                    break;
                case 2:
                    //上架中
                    vm.status = ['NORMAL'];
                    vm.type = "CURRENT";
                    break;
                case 3:
                    //未上架
                    vm.status = ['SALE_OFF'];
                    vm.type = "CURRENT";
                    break;
            }
            if (vm.tab !== index) {
                vm.tab = index;
                vm.pageEnd = false;
                vm.curPage = 0;
                vm.data = {userOrg: "", items: []};
                vm.orgItemIds = [];
                vm.tableIndex = index - 1;
                vm.getInfo();
            }
        };

        vm.selectedOrgItems = [];
        //上架
        vm.shopSaleOn = function (orgItemIds) {
            vm.selectedOrgItems = [];
            if (orgItemIds) {
                var idx = vm.orgItemIds.indexOf(orgItemIds);
                if (idx <= -1) {
                    alertService.msgAlert("ks-cancle", "未选择商品");
                    return;
                }
                vm.selectedOrgItems.push(orgItemIds);
            } else {
                vm.selectedOrgItems = vm.orgItemIds;
            }
            if (vm.selectedOrgItems.length <= 0) {
                alertService.msgAlert("ks-cancle", "未选择商品");
                return;
            }
            alertService.confirm(null, "", "确定上架？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + "/managerOrg/shopSaleOn",
                        data: $httpParamSerializer({
                            orgItemIds: vm.selectedOrgItems
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                            if (resp.data.code === 'SUCCESS') {
                                vm.orgItemIds = [];
                                vm.getNums();
                                vm.pageEnd = false;
                                vm.curPage = 0;
                                vm.data = {userOrg: "", items: []};
                                vm.orgItemIds = [];
                                vm.getInfo();
                            }
                        }, function () {

                        }
                    );
                }
            });

        };

        //下架
        vm.shopSaleOff = function (orgItemIds) {
            vm.selectedOrgItems = [];
            if (orgItemIds) {
                var idx = vm.orgItemIds.indexOf(orgItemIds);
                if (idx <= -1) {
                    alertService.msgAlert("ks-cancle", "未选择商品");
                    return;
                }
                vm.selectedOrgItems.push(orgItemIds);
            } else {
                vm.selectedOrgItems = vm.orgItemIds;
            }
            if (vm.selectedOrgItems.length <= 0) {
                alertService.msgAlert("ks-cancle", "未选择商品");
                return;
            }
            alertService.confirm(null, "", "确定下架？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + "/managerOrg/shopSaleOff",
                        data: $httpParamSerializer({
                            orgItemIds: vm.selectedOrgItems
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                            if (resp.data.code === 'SUCCESS') {
                                vm.orgItemIds = [];
                                vm.getNums();
                                vm.pageEnd = false;
                                vm.curPage = 0;
                                vm.data = {userOrg: "", items: []};
                                vm.orgItemIds = [];
                                vm.getInfo();
                            }
                        }, function () {

                        }
                    );
                }
            });

        };
        //初始化数据
        vm.getNums();
        vm.statusQueryAll(vm.tab);
        vm.getInfo();

    }
})();