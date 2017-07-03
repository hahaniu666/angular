(function () {


    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 防伪溯源
         */
        $stateProvider.state("main.service.security", {
            url: "/security",
            views: {
                "@": {
                    templateUrl: 'views/main/service/security/index.root.html',
                    controller: securityController
                }
            }
        });
    }]);
    securityController.$inject=['$scope', '$http', 'appConfig', "$state", "imgService"];
    function securityController($scope, $http, appConfig, $state, imgService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;  //页面展示页数
        $scope.pageSize = appConfig.pageSize;  //页面展示条数
        $scope.imgUrl = appConfig.imgUrl;
        $scope.imgService = imgService;
        $scope.pageEnd = false;                 //是否是最后一页
        $scope.curPage = 1;
        $scope.queryItemVerify = function (curPage) {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/service/itemVerifyList?curPage=' + curPage + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data=resp.data;
                ////分页及加载更多
                if (curPage > 1) {
                    for (var i = 0; i < data.verifyList.length; i++) {
                        $scope.verifys.verifyList.push(data.verifyList[i]);
                    }
                } else {
                    $scope.verifys = data;
                }
                $scope.curPage = curPage + 1;
                /**
                 * 判断是否最后一页
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
                ////分页结束
                if ($scope.verifys.verifyList[0]) {
                    $scope.noverifyShow = false;
                } else {
                    $scope.noverifyShow = true;
                }
            },function () {
                $scope.noverifyShow = true;
            });
        };
        $scope.queryItemVerify(1);
        // 进行翻页记录
        $scope.pageChanged = function () {
            $scope.queryItemVerify($scope.verifys.curPage);
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();