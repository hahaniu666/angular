(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip", {
                url: "/vip",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }],
                    payMenthod: [function () {
                        return {};
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/index.root.html',
                        controller: vipController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    vipController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', "imgService", "$timeout", "urlbackService"];
    function vipController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService, $timeout, urlbackService) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.imgService = imgService;
        vm.showSign = false;
        vm.swipers = {};


        // 进行签到
        vm.signs = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/integral/sign',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                vm.data.toDaySign = true;

                //showSign来判断是否弹出钱币加10
                vm.showSign = true;
                vm.data.sign = vm.data.sign + 1;
                vm.data.count = vm.data.count + 1;
                vm.data.integral = resp.data.integral;
                vm.lodingThis();
            }, function () {
            });
        };
        // 进行签到
        vm.data = {"toDaySign": false, "integral": 0, "sign": 0, "count": 0, "advertise": null};
        vm.lodingThis = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/integral/index'
            }).then(function (resp) {
                vm.data = resp.data.result;

                if (vm.data.toDaySign === true) {
                    var $aDiv1 = angular.element('#creat');
                    $aDiv1.empty();
                    var $mdIcon1 = '<div>今日已签</div>';
                    $aDiv1.append($mdIcon1);
                    $aDiv1.addClass('finshBtn');
                }
                else if (vm.data.toDaySign === false) {
                    var $aDiv2 = angular.element('#creat');
                    $aDiv2.empty();
                    var $mdIcon2 = '<div>签到</div>';
                    $aDiv2.append($mdIcon2);
                    $aDiv2.addClass('beginBtn');
                    $aDiv2.click(function () {
                        vm.signs();
                    });
                }
            });
        };
        vm.lodingThis();
        //获取等级信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/integral/user"
        }).then(function (resp) {
            vm.data1 = resp.data;
            for (var i = 0; i < vm.data1.agents.length; i++) {
                if (vm.data1.agent === vm.data1.agents[i].id) {
                    vm.order = vm.data1.agents[i].order;
                }
            }
        }, function () {
        });

        $http({
            method: 'GET',
            url: appConfig.apiPath + '/common/imgCarousel',
            params: {
                type: "VIP_SHOP"
            }
        }).then(function (resp) {
            vm.imgCarousel = resp.data.recList;
            // 没有品牌导购,则不用进行滑动图片
            $timeout(function () {
                vm.swipers.update();
            });
        });
        // 进行退款
        vm.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };

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
                url: appConfig.apiPath + "/integral/itemList?curPage=" + vm.curPage + "&pageSize=" + vm.pageSize,
                params: {
                    type: vm.tab
                }
            }).then(function (resp) {
                    var data = resp.data;
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    if (vm.curPage > 1) {
                        for (var i = 0; i < data.result.length; i++) {
                            vm.comments.result.push(data.result[i]);
                        }
                    } else {
                        vm.comments = data;
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

        // 面板
        vm.tabs = function (num) {
            vm.tab = num;
            vm.curPage = 1;
            vm.page();
        };
        vm.tabs("SERVICE");
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