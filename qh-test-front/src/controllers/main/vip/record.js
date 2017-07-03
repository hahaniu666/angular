(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.record", {
                url: "/record",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/record/index.root.html',
                        controller: vipRecordController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    vipRecordController.$inject = ['$http', '$state', 'appConfig', 'imgService'];
    function vipRecordController($http, $state, appConfig, imgService) {
        var vm = this;


        vm.appConfig = appConfig;
        vm.imgService = imgService;
        vm.maxSize = appConfig.maxSize;
        //页面展示页数   5
        vm.pageSize = appConfig.pageSize;
        //页面展示条数   10
        vm.pageEnd = false;    //是否是最后一页
        vm.curPage = 1;

        vm.page = function () {
            //获取账户信息
            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/orderList?curPage=" + vm.curPage + "&pageSize=" + vm.pageSize
            }).then(function (resp) {
                    var data = resp.data;
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    if (vm.curPage > 1) {
                        for (var i = 0; i < data.result.length; i++) {
                            vm.record.result.push(data.result[i]);
                        }
                    } else {
                        vm.record = data;
                    }

                    vm.curPage = data.curPage + 1;
                    vm.totalCount = data.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    if (data.totalCount % vm.pageSize !== 0) {
                        if (Math.floor(data.totalCount / vm.pageSize) + 1 === data.curPage) {
                            vm.pageEnd = true;
                        }
                    } else {
                        if (Math.floor(data.totalCount / vm.pageSize) === data.curPage) {
                            vm.pageEnd = true;
                        }
                    }
                    //如果只有一页
                    if (data.totalCount <= vm.pageSize) {
                        vm.pageEnd = true;
                        vm.curPage = 1;
                    }
                }, function () {
                }
            );
        };
        vm.page();
        vm.orderDetail = function (order) {
            $state.go("main.vip.orderDetail", {id: order.id}, {reload: true});
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