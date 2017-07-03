(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.extension.inviter", {
            url: "/inviter",
            views: {
                "@": {
                    templateUrl: 'views/main/extension/inviter/index.root.html',
                    controller: inviterController
                }
            }
        });
    }]);
    inviterController.$inject=['$scope', '$http', '$state', 'appConfig','$filter'];
    function inviterController($scope, $http, $state, appConfig, $filter) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL

        $scope.pageEnd = false;                 //是否是最后一页
        $scope.curPage = 1;

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.queryInviter = function (page) {
            /**
             * 用户推广的记录人
             */
            $http({
                method: "GET",
                url: appConfig.apiPath + "/user/queryInviter?curPage=" + page + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data = resp.data;
                /**
                 * 判断是否是第一页，不是就追加数据
                 */
                if ($scope.curPage > 1) {
                    for (var i = 0; i < data.users.length; i++) {
                        $scope.counts.users.push(data.users[i]);
                    }
                } else {
                    $scope.counts = data;
                }
                $scope.curPage = data.curPage + 1;
                /**
                 * 判断是否最最后一页
                 */
                if (data.totalCount % $scope.pageSize !== 0) {
                    if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageEnd = true;
                    }
                } else {
                    if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                        $scope.pageEnd = true;
                    }
                }
                //如果只有一页
                if (data.totalCount <= $scope.pageSize) {
                    $scope.pageEnd = true;
                    $scope.curPage = 1;
                }
                /**
                 * 将后台取来的数据 进行每天分割汇总进行记录
                 */
                $scope.counts.sort = [];
                for (var i = 0; i < $scope.counts.users.length; i++) {
                    var date = $filter("date")($scope.counts.users[i].date, 'MMdd');
                    if ($scope.counts.sort[$scope.counts.sort.length - 1] && date === $scope.counts.sort[$scope.counts.sort.length - 1].date) {
                        /**
                         * 判断是否和上一次的日期一样，一样就直接添加
                         */
                        $scope.counts.sort[$scope.counts.sort.length - 1].users.push($scope.counts.users[i]);
                    } else {
                        /**
                         * 没有和上次一样的日期，添加节点，并添加用户
                         */
                        var month = $filter("date")($scope.counts.users[i].date, 'MM');
                        var day = $filter("date")($scope.counts.users[i].date, 'dd');
                        var users = [];
                        users.push($scope.counts.users[i]);
                        $scope.counts.sort.push({
                            month: month,
                            day: day,
                            date: month + day,
                            users: users
                        });
                    }
                }
            }, function () {

            });
        };
        $scope.queryInviter(1);
        $scope.pageChanged = function () {
            $scope.queryInviter($scope.counts.curPage);
        };
    }
})();
