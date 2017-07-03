(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.myPoints", {
                url: "/myPoints?tabId",   //tabId是从会员中心跳转过来带的参数，用来判断选项卡
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/myPoints/index.root.html',
                        controller: myPointsController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    myPointsController.$inject = [ '$http', '$state', 'appConfig'];
    function myPointsController( $http, $state, appConfig) {
        var vm = this;
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        if ($state.params.tabId === undefined) {
            vm.tab = 'integral';
        } else {
            vm.tab = $state.params.tabId;
        }
        //选项卡
        vm.tabs = function (num) {
            vm.tab = num;
        };
        // 进行签到
        vm.data = {"toDaySign": false, "integral": 0, "sign": 0, "count": 0, "advertise": null, "totalIntegral": 0};
        $http({
            method: 'GET',
            url: appConfig.apiPath + '/integral/index'
        }).then(function (resp) {
            vm.data = resp.data.result;
        });
        vm.account = {};
        // 钱币明细

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
                url: appConfig.apiPath + "/wallet/accountLog?curPage=" + vm.curPage + "&pageSize=" + appConfig.pageSize + "&integral=true"
            }).then(function (resp) {
                    var data = resp.data;
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    if (vm.curPage > 1) {
                        for (var i = 0; i < data.recList.length; i++) {
                            vm.account.recList.push(data.recList[i]);
                        }
                    } else {
                        vm.account = data;
                    }
                    vm.curPage = data.curPage + 1;
                    vm.totalCount = data.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    vm.pageEnd = false;
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
    }
})();