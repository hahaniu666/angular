(function () {
    "use strict";
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.extension.commission", {
                url: "/commission",
                views: {
                    "@": {
                        templateUrl: 'views/main/extension/commission/index.root.html',
                        controller: commissionController
                    }
                }
            });
        }]);
    commissionController.$inject = ['$scope', '$http', '$state', 'appConfig'];
    function commissionController($scope, $http, $state, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.pageEnd = {frozen: false, available: false, fail: false};
        $scope.curPage = {frozen: 1, available: 1, fail: 1};        //下一个页码

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.view = {frozen: true, available: false, fail: false};
        $scope.viewStatus = function (status) {
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

    }
})();