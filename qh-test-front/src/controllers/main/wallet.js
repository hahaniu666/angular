(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet", {
                url: "/wallet?back?num&tabId",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/index.root.html',
                        controller: balanceDetailController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    balanceDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService'];
    function balanceDetailController($scope, $http, $state, appConfig, alertService) {

        var vm = this;

        $scope.back = $state.params.back;
        $scope.fallbackPage = function () {
            if ($scope.back) {
                $state.go("main.hotelManage", null, {reload: true});
            } else {
                $state.go("main.center", null, {reload: true});

            }
        };
        $scope.num1 = 1
        $scope.num3 = 1;
        $scope.num = $state.params.num ? $state.params.num : 1;
        $scope.btnClick = function (num) {
            $scope.num = num;
        };
        $scope.btnClick1 = function (num) {
            $scope.num1 = num;
        };
        $scope.btnClick3 = function (num) {
            $scope.num3 = num;
        };

        $scope.getaccount = function () {
            //获取余额
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/account"
            }).then(function (resp) {
                var data = resp.data;
                $scope.canamount = data.canAmount;
                $scope.notamount = data.notAmount;
                $scope.giftAmount = data.giftAmount;
            }, function () {
                alertService.msgAlert('ks-exclamation-circle', '获取余额失败！');
            });
        };
        $scope.getaccount();

        //获取等级信息
        $scope.getIntegral = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/user"
            }).then(function (resp) {
                $scope.userData = resp.data;
                for (var i = 0; i < $scope.userData.agents.length; i++) {
                    if ($scope.userData.agent === $scope.userData.agents[i].id) {
                        $scope.order = $scope.userData.agents[i].order;
                        $scope.name = $scope.userData.agents[i].name;
                        $scope.needIntegral = $scope.userData.agents[i].integral;
                        $scope.tab = $scope.order;
                    }
                }
            }, function () {
            });
        };
        $scope.getIntegral();
        // $scope.getaccount = function () {
        //     //获取余额
        //     $http({
        //         method: "GET",
        //         url: appConfig.apiPath + "/wallet/account"
        //     }).then(function (resp) {
        //         var data = resp.data;
        //         $scope.canamount = data.canAmount;
        //         $scope.notamount = data.notAmount;
        //         $scope.giftAmount = data.giftAmount;
        //     }, function () {
        //         alertService.msgAlert('ks-exclamation-circle', '获取余额失败！');
        //     });
        // };
        // $scope.getaccount();
        //
        //
        // //获取礼品卡
        // $http({
        //     method: "GET",
        //     url: appConfig.apiPath + "/wallet/rechargeActivity"
        // }).then(function (resp) {
        //     var data = resp.data;
        //     $scope.reclist = data.recList;
        // });
        //
        // /**
        //  * 兑换礼品卡
        //  */
        // $scope.exchangeGiftCard = function () {
        //     if (!$scope.giftCardCode || $scope.giftCardCode === '') {
        //         alertService.msgAlert('ks-exclamation-circle', '请正确输入兑换码！');
        //         return;
        //     }
        //     $http({
        //         method: "POST",
        //         url: appConfig.apiPath + "/coupon/exchange",
        //         params: {
        //             code: $scope.giftCardCode,
        //             type: 'CARD'
        //         },
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //         }
        //     }).then(function () {
        //         alertService.msgAlert('ks-success', '兑换成功！');
        //         $scope.giftCardCode = '';
        //         $scope.getaccount();
        //     }, function () {
        //     });
        // };


        /*
         * 金币对应js
         * */
        if ($state.params.tabId === undefined) {
            vm.tab = 'integral';
        } else {
            vm.tab = $state.params.tabId;
        }
        /*
         * 钱币钱币
         * */
        $scope.coinRecAccount = {};
        $scope.coinUseAccount = {};

        // 钱币明细
        vm.maxSize = appConfig.maxSize;
        //页面展示页数   5
        vm.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.recPageEnd = false;    //是否是最后一页
        vm.curRecPage = 1;

        vm.pageUseEnd = false;    //是否是最后一页
        vm.curUsePage = 1;

        $scope.recPage = function () {
            console.log($scope.recPageEnd);
            //获取账户信息
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/accountLog?curPage=" + vm.curRecPage + "&pageSize=" + appConfig.pageSize + "&integral=true" + "&status=in"
            }).then(function (resp) {
                    var coinData = resp.data;
                    console.log(coinData);
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    console.log(vm.curRecPage);
                    if (vm.curRecPage > 1) {
                        for (var i = 0; i < coinData.recList.length; i++) {
                            $scope.coinRecAccount.recList.push(coinData.recList[i]);
                            console.log($scope.coinRecAccount.recList);
                        }
                        // for (var i = 0; i < data.useList.length; i++) {
                        //     $scope.coinRecAccount.useList.push(data.useList[i]);
                        //     console.log($scope.coinRecAccount.useList);
                        // }
                    } else {
                        $scope.coinRecAccount = coinData;
                    }
                    vm.curRecPage = coinData.curPage + 1;
                    $scope.totalRecCount = coinData.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    // $scope.recPageEnd = false;
                    if (coinData.totalCount % vm.pageSize !== 0) {
                        console.log(coinData.curPage);
                        console.log(Math.floor(coinData.totalCount / vm.pageSize) + 1);

                        if (Math.floor(coinData.totalCount / vm.pageSize) + 1 === coinData.curPage) {
                            $scope.recPageEnd = true;
                            console.log($scope.recPageEnd);
                        }
                    } else {
                        console.log(coinData.curPage);

                        if (Math.floor(coinData.totalCount / vm.pageSize) === coinData.curPage) {
                            $scope.recPageEnd = true;
                        }
                    }
                    //如果只有一页
                    if (coinData.totalCount <= vm.pageSize) {
                        $scope.recPageEnd = true;
                        vm.curRecPage = 1;
                    }
                }, function () {
                }
            );
        };
        $scope.recPage();

        $scope.usePage = function () {
            console.log($scope.usePageEnd);
            //获取账户信息
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/accountLog?curPage=" + vm.curUsePage + "&pageSize=" + appConfig.pageSize + "&integral=true" + "&status=out"
            }).then(function (resp) {
                    var coinData = resp.data;
                    console.log(coinData);
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    console.log(vm.curUsePage);
                    if (vm.curUsePage > 1) {
                        for (var i = 0; i < coinData.useList.length; i++) {
                            $scope.coinUseAccount.useList.push(coinData.useList[i]);
                            console.log($scope.coinUseAccount.useList);
                        }
                    } else {
                        $scope.coinUseAccount = coinData;
                    }
                    vm.curUsePage = coinData.curPage + 1;
                    $scope.useTotalCount = coinData.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    // $scope.usePageEnd = false;
                    if (coinData.totalCount % vm.pageSize !== 0) {
                        console.log(coinData.curPage);
                        console.log(Math.floor(coinData.totalCount / vm.pageSize) + 1);

                        if (Math.floor(coinData.totalCount / vm.pageSize) + 1 === coinData.curPage) {
                            $scope.usePageEnd = true;
                            console.log($scope.usePageEnd);
                        }
                    } else {
                        console.log(coinData.curPage);

                        if (Math.floor(coinData.totalCount / vm.pageSize) === coinData.curPage) {
                            $scope.usePageEnd = true;
                        }
                    }
                    //如果只有一页
                    if (coinData.totalCount <= vm.pageSize) {
                        $scope.usePageEnd = true;
                        vm.curusePage = 1;
                    }
                }, function () {
                }
            );
        };
        $scope.usePage();

        /*
         * 获取佣金页面对应js
         * */

        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.pageEnd = {frozen: false, available: false, fail: false};
        $scope.curPage = {frozen: 1, available: 1, fail: 1};        //下一个页码

        // $scope.fallbackPage = function () {
        //     if (history.length === 1) {
        //         $state.go("main.index", null, {reload: true});
        //     } else {
        //         history.back();
        //     }
        // };
        $scope.num2 = 1;
        $scope.view = {frozen: true, available: false, fail: false};
        $scope.viewStatus = function (status) {
            $scope.num2 = status;
            $scope.view = {frozen: false, available: false, fail: false};
            if (status === 1) {
                $scope.view.frozen = true;
            } else if (status === 2) {
                $scope.view.available = true;
            } else {
                $scope.view.fail = true;
            }
        };

        /**
         * 冻结中的佣金
         */
        $scope.queryFrozen = function (curPage) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/user/queryCommission?curPage=" + curPage + "&pageSize=" + $scope.pageSize + "&status=FROZEN"
            }).then(
                function (resp) {
                    var data = resp.data;
                    if (curPage > 1) {
                        for (var i = 0; i < data.commission.length; i++) {
                            $scope.frozen.commission.push(data.commission[i]);
                        }
                    } else {
                        $scope.frozen = data;
                    }
                    $scope.curPage.frozen = curPage + 1;

                    if (data.totalCount % $scope.pageSize !== 0) {
                        if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                            $scope.pageEnd.frozen = true;
                        }
                    } else {
                        if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                            $scope.pageEnd.frozen = true;
                        }
                    }
                    //如果只有一页
                    if (data.totalCount < $scope.pageSize) {
                        $scope.pageEnd.frozen = true;
                        $scope.curPage.frozen = 1;
                    }
                });
        };

        /**
         * 已经成功的佣金
         */
        $scope.queryAvailable = function (curPage) {

            $http({
                method: 'GET',
                url: appConfig.apiPath + "/user/queryCommission?curPage=" + curPage + "&pageSize=" + $scope.pageSize + "&status=AVAILABLE"
            }).then(function (resp) {
                var data = resp.data;
                if (curPage > 1) {
                    for (var i = 0; i < data.commission.length; i++) {
                        $scope.available.commission.push(data.commission[i]);
                    }
                } else {
                    $scope.available = data;
                }
                $scope.curPage.available = curPage + 1;

                if (data.totalCount % $scope.pageSize !== 0) {
                    if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageEnd.available = true;
                    }
                } else {
                    if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                        $scope.pageEnd.available = true;
                    }
                }
                //如果只有一页
                if (data.totalCount <= $scope.pageSize) {
                    $scope.pageEnd.available = true;
                    $scope.curPage.available = 1;
                }
            }, function () {

            });
        };

        /**
         * 失败的佣金
         */
        $scope.queryFail = function (curPage) {
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/user/queryCommission?curPage=" + curPage + "&pageSize=" + $scope.pageSize + "&status=FAIL"
            }).then(function (resp) {
                var data = resp.data;
                if (curPage > 1) {
                    for (var i = 0; i < data.commission.length; i++) {
                        $scope.fail.commission.push(data.commission[i]);
                    }
                } else {
                    $scope.fail = data;
                }
                $scope.curPage.fail = curPage + 1;

                if (data.totalCount % $scope.pageSize !== 0) {
                    if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageEnd.fail = true;
                    }
                } else {
                    if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                        $scope.pageEnd.fail = true;
                    }
                }
                //如果只有一页
                if (data.totalCount < $scope.pageSize) {
                    $scope.pageEnd.fail = true;
                    $scope.curPage.fail = 1;
                }
            }, function () {

            });
        };


        $scope.queryFrozen(1);
        $scope.queryAvailable(1);
        $scope.queryFail(1);


        /*
         *
         * 礼品卡相关，服务卡
         * */


        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.pageRecEnd = false;                 //是否是最后一页
        $scope.pageUseEnd = false;                 //是否是最后一页

        $scope.curRecPage = 1;
        $scope.curUsePage = 1;

        $scope.recCounts = {}
        $scope.useCounts = {};

        $scope.transRecRecord = function (page) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/giftAccountLog?curPage=" + page + "&pageSize=" + $scope.pageSize + "&status=in"
            }).then(function (resp) {
                var data = resp.data;
                /**
                 * 判断是否是第1页，不是就追加数据
                 */
                if ($scope.curRecPage > 1) {
                    for (var i = 0; i < data.recList.length; i++) {
                        $scope.recCounts.recList.push(data.recList[i])
                    }
                    $scope.recCounts.curRecPage = page;
                } else {
                    $scope.recCounts = data;
                }
                $scope.curRecPage = data.curPage + 1;
                $scope.totalRecCount = data.totalCount;
                /**
                 * 判断是否是最后一页
                 */
                if ($scope.totalRecCount % $scope.pageSize !== 0) {
                    if (Math.floor($scope.totalRecCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageRecEnd = true;
                    }
                } else {
                    if (Math.floor($scope.totalRecCount / $scope.pageSize) === data.curPage) {
                        $scope.pageRecEnd = true;
                    }
                }
                //如果只有一页
                if ($scope.totalRecCount <= $scope.pageSize) {
                    $scope.pageRecEnd = true;
                    $scope.curRecPage = 1;
                }
            }, function () {
            });
        };

        $scope.transUseRecord = function (page) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/giftAccountLog?curPage=" + page + "&pageSize=" + $scope.pageSize + "&status=out"
            }).then(function (resp) {
                var data = resp.data;
                /**
                 * 判断是否是第1页，不是就追加数据
                 */
                if ($scope.curUsePage > 1) {
                    for (var i = 0; i < data.useList.length; i++) {
                        $scope.useCounts.useList.push(data.useList[i]);
                    }
                    $scope.useCounts.curUsePage = page;
                } else {
                    $scope.useCounts = data;
                }
                $scope.curUsePage = data.curPage + 1;
                $scope.totalUseCount = data.totalCount;
                /**
                 * 判断是否是最后一页
                 */
                if ($scope.totalUseCount % $scope.pageSize !== 0) {
                    if (Math.floor($scope.totalUseCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageUseEnd = true;
                    }
                } else {
                    if (Math.floor($scope.totalUseCount / $scope.pageSize) === data.curPage) {
                        $scope.pageUseEnd = true;
                    }
                }
                //如果只有一页
                if ($scope.totalUseCount <= $scope.pageSize) {
                    $scope.pageUseEnd = true;
                    $scope.curUsePage = 1;
                }
            }, function () {
            });
        };

        /**
         * 兑换礼品卡
         */
        $scope.card = {};
        $scope.exchangeGiftCard = function () {
            console.log($scope.card.giftCardCode);
            if (!$scope.card.giftCardCode || $scope.card.giftCardCode === '') {
                alertService.msgAlert('ks-exclamation-circle', '请正确输入兑换码！');
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + "/coupon/exchange",
                params: {
                    code: $scope.card.giftCardCode,
                    type: 'CARD'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                alertService.msgAlert('ks-success', '兑换成功！');
                $scope.card = {};
                // $scope.getaccount();
                $scope.transRecord(1);
            }, function () {
            });
        };

        $scope.transRecRecord(1);
        $scope.transUseRecord(1);
    }
})();