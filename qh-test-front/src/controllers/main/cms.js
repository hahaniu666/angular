(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 友情链接
         */
        $stateProvider.state("main.cms", {
            url: "/cms",
            views: {
                "@": {
                    templateUrl: 'views/main/cms/index.root.html',
                    controller: activityController
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    activityController.$inject = ['$scope', '$http', '$state', 'imgService', 'appConfig'];
    function activityController($scope, $http, $state, imgService, appConfig) {

        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.itemImg = imgService.itemImg;
        $scope.maxSize = appConfig.maxSize;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.pageEnd = false;


        $scope.queryActivity = function (curPage) {
            $http.get(appConfig.apiPath + '/common/activityList?curPage=' + curPage + "&pageSize=" + $scope.pageSize)
                .success(function (data) {
                    if(curPage === 1){
                        $scope.activity = data;
                    }else{
                        //如果不是第一页，追加数据
                        for(var i = 0; i < data.cmsPage.length; i++){
                            $scope.activity.cmsPage.push(data.cmsPage[i]);
                        }
                    }
                    var page = parseInt($scope.activity.totalCount / $scope.activity.pageSize);
                    if ($scope.activity.totalCount % $scope.activity.pageSize > 0) {
                        page++;
                    }
                    if (page <= $scope.activity.curPage) {
                        $scope.activity.pageEnd = true;
                    } else {
                        $scope.activity.curPage++;
                    }
                });
        };
        $scope.queryActivity(1);
        $scope.pageChanged = function () {
            $scope.queryActivity(2);
        };
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();