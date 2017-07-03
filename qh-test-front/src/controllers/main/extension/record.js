(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.extension.record", {
            url: "/record",
            views: {
                "@": {
                    templateUrl: 'views/main/extension/record/index.root.html',
                    controller: recordController
                }
            }
        });
    }]);
    recordController.$inject=['$scope' ,'$http', '$state', 'appConfig'];
    function recordController($scope, $http, $state, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.pageEnd = false;                 //是否是最后一页
        $scope.curPage = 1;
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.queryRecord = function (page) {
            /**
             * 用户提现记录数
             */
            $http({
                method:'GET',
                url:appConfig.apiPath + "/user/queryRecode?curPage=" + page + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data = resp.data;
                /**
                 * 判断是否是第1页，不是就追加数据
                 */
                if ($scope.curPage > 1) {
                    for (var i = 0; i < data.recode.length; i++) {
                        $scope.counts.recode.push(data.recode[i]);
                    }
                    $scope.counts.curPage = page;
                } else {
                    $scope.counts = data;
                }
                $scope.curPage = data.curPage + 1;
                /**
                 * 判断是否是最后一页
                 */
                if(data.totalCount % $scope.pageSize !== 0){
                    if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageEnd = true;
                    }
                }else{
                    if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                        $scope.pageEnd = true;
                    }
                }
                //如果只有一页
                if(data.totalCount <= $scope.pageSize){
                    $scope.pageEnd = true;
                    $scope.curPage = 1;
                }
            },function () {
            });
        };
        $scope.queryRecord(1);
        $scope.pageChanged = function () {
            $scope.queryRecord($scope.counts.curPage);
        };
    }
})();