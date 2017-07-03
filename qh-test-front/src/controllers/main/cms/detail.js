(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 友情链接详情
         */
        $stateProvider.state("main.cms.detail", {
            url: "/detail?id",
            views: {
                "@": {
                    templateUrl: 'views/main/cms/detail/index.root.html',
                    controller: detailController
                }
            }
        });

    }]);


    // ----------------------------------------------------------------------------
    detailController.$inject = ['$scope', '$http', '$state', '$rootScope', 'imgService', 'appConfig'];
    function detailController($scope, $http, $state, $rootScope, imgService, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.itemImg = imgService.itemImg;

        // 缓存该商品的详情
        $scope.getSkuDetail = function () {
            // 获取该商品的详情
            $http({
                method: "GET",
                url: appConfig.apiPath + "/helpCenter/pageText?id=" + $scope.date.id
            }).then(function (resp) {
                var data = resp.data;
                var content = data.content.replace(/src\s*=\s*\"(http:\S+)\"/g, "src=\"$1?imageView2/2/w/" + $scope.itemImg.w + "\"");
                $rootScope.activityCache.put($scope.date.id, {
                    date: $scope.date.date,
                    content: content
                });
                $scope.date.content = content;
            });
        };


        $http({
            method: 'GET',
            url: appConfig.apiPath + '/helpCenter/pageDetail?id=' + $state.params.id
        }).then(function (data) {
            $scope.date = data.data;
            if ($rootScope.activityCache.get($scope.date.id) === undefined) {
                $scope.getSkuDetail();
            } else {
                var tempDetail = $rootScope.activityCache.get($scope.date.id);
                if (tempDetail.date !== $scope.date.date) {
                    $scope.getSkuDetail();
                } else {
                    $scope.date.content = tempDetail.content;
                }
            }
        }, function () {

        });

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();