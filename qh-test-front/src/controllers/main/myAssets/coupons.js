(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 获取我的优惠券信息
         */
        $stateProvider.state("main.myAssets.coupons", {
            url: "/coupons",
            views: {
                "@": {
                    templateUrl: 'views/main/myAssets/coupons/index.root.html',
                    controller: couponsController
                }
            }
        });
    }]);
    couponsController.$inject = ['alertService', '$scope', '$http', 'appConfig', "$state", '$httpParamSerializer'];
    function couponsController(alertService, $scope, $http, appConfig, $state, $httpParamSerializer) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.pageSize = appConfig.pageSize;
        $scope.maxSize = appConfig.maxSize;  //页面展示页数
        $scope.notUsedNever = false;
        $scope.notUsedNot = false;

        $scope.notuseShow = true;//默认选择未使用
        //点击未使用的时候，显示未使用的内容
        $scope.notuse = function () {
            $scope.notuseShow = true;
        };
        $scope.usedShow = function () {
            $scope.notuseShow = false;
        };
        // 选择未使用、已使用的、过期的
        $scope.vsChange = {not: true, already: false, overdue: false, code: null};
        $scope.clickChange = function (status) {
            if (status === 1) {
                $scope.vsChange = {
                    not: true,
                    already: false,
                    overdue: false,
                    code: $scope.vsChange.code
                };
            } else if (status === 2) {
                $scope.vsChange = {
                    not: false,
                    already: true,
                    overdue: false,
                    code: $scope.vsChange.code
                };
            } else {
                $scope.vsChange = {
                    not: false,
                    already: false,
                    overdue: true,
                    code: $scope.vsChange.code
                };
            }
        };
        //未使用优惠券
        $scope.queryNotCoupon = function (curPage) {


            $http({
                method: 'GET',
                url: appConfig.apiPath + '/coupon/coupon?status=1&curPage=' + curPage + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data = resp.data;
                if (curPage === 1) {
                    $scope.not = data;
                } else {
                    //如果不是第一页，追加数据
                    for (var i = 0; i < data.resList.length; i++) {
                        $scope.not.resList.push(data.resList[i]);
                    }
                }
                //显示盖章
                var page = parseInt($scope.not.totalCount / $scope.not.pageSize);
                if ($scope.not.totalCount % $scope.not.pageSize > 0) {
                    page++;
                }
                if (page <= $scope.not.curPage) {
                    $scope.not.pageEnd = true;
                } else {
                    $scope.not.curPage++;
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        // 兑换优惠券
        $scope.exchange = function () {
            if (!$scope.vsChange.code) {
                alertService.msgAlert("exclamation-circle", "请输入兑换码");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/coupon/exchange',
                data: $httpParamSerializer({code: $scope.vsChange.code}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})
                $scope.queryNotCoupon(1);
                $scope.vsChange.code = "";
            }).error(function () {
            });
        };
        //加载第一页
        $scope.queryNotCoupon(1);
        //未使用优惠券翻页
        $scope.notPageChanged = function () {
            $scope.queryNotCoupon($scope.not.curPage);
        };

        //不可用优惠券
        $scope.usecouponshow = true;
        $scope.queryAlreadyCoupon = function (curPage) {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/coupon/coupon?status=2&curPage=' + curPage + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data = resp.data;
                if (curPage === 1) {
                    $scope.already = data;
                } else {
                    //如果不是第一页，追加数据
                    for (var i = 0; i < data.resList.length; i++) {
                        $scope.already.resList.push(data.resList[i]);
                    }
                }
                if ($scope.already.totalCount > 0) {
                    $scope.usecouponshow = true;
                } else {
                    $scope.usecouponshow = false;
                }
                for (var i = 0; i < $scope.already.resList.length; i++) {
                    $scope.already.resList[i].alreadyUsed = true;
                    $scope.already.resList[i].alreadyOverdue = false;
                }
                var page = parseInt($scope.already.totalCount / $scope.already.pageSize);
                if ($scope.already.totalCount % $scope.already.pageSize > 0) {
                    page++;
                }
                if (page <= $scope.already.curPage) {
                    $scope.already.pageEnd = true;
                } else {
                    $scope.already.curPage++;
                }
            },function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryAlreadyCoupon(1);
        //不可用优惠券翻页
        $scope.alreadyPageChanged = function () {
            $scope.queryAlreadyCoupon($scope.already.curPage);
        };

        /**
         * 过期的进行查询
         * @param curPage
         */
        $scope.queryOverdueCoupon = function (curPage) {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/coupon/coupon?status=3&curPage=' + curPage + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data =resp.data;
                if (curPage === 1) {
                    $scope.overdue = data;
                } else {
                    //如果不是第一页，追加数据
                    for (var i = 0; i < data.resList.length; i++) {
                        $scope.overdue.resList.push(data.resList[i]);
                    }
                }
                var page = parseInt($scope.overdue.totalCount / $scope.overdue.pageSize);
                if ($scope.overdue.totalCount % $scope.overdue.pageSize > 0) {
                    page++;
                }
                if (page <= $scope.overdue.curPage) {
                    $scope.overdue.pageEnd = true;
                } else {
                    $scope.overdue.curPage++;
                }
            },function (resp) {
                var data =resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryOverdueCoupon(1);
        //不可用优惠券翻页
        $scope.overduePageChanged = function () {
            $scope.queryOverdueCoupon($scope.overdue.curPage);
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                $state.go("main.center", null, {reload: true});
            }
        };
    }
})();