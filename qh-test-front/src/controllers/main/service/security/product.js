(function () {


    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 防伪溯源,已经验证过的被子查看具体详情参数
         */
        $stateProvider.state("main.service.security.product", {
            url: "/product?id&code",
            views: {
                "@": {
                    templateUrl: 'views/main/service/security/product/index.root.html',
                    controller: productController
                }
            }
        });
    }]);
    productController.$inject=['$scope', '$http', '$state', '$rootScope', 'appConfig', 'imgService'];
    function productController($scope, $http,  $state, $rootScope, appConfig, imgService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();

        $scope.logId = $state.params.id;
        $scope.maxSize = appConfig.maxSize;  //页面展示页数
        $scope.pageSize = appConfig.pageSize;  //页面展示条数
        $scope.code = $state.params.code;
        $scope.itemImg = imgService.itemImg;

        //生产跟踪
        $scope.queryProductTrack = function (curPage) {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/service/productTrack?logId=' + $scope.logId + "&curPage=" + curPage + "&pageSize=" + $scope.pageSize
            }).then(function (resp) {
                var data=resp.data;
                $scope.tracks = data;
            },function () {

            });
        };
        // 缓存该商品的详情
        $scope.getSkuDetail = function () {
            // 获取该商品的详情

            $http({
                method:'GET',
                url:appConfig.apiPath + "/service/productText?logId=" + $scope.logId
            }).then(function (resp) {
                var data=resp.data;
                var detail = data.detail.replace(/src\s*=\s*\"(http:\S+)\"/g, "src=\"$1?imageView2/2/w/" + $scope.itemImg.w + "\"");
                $rootScope.productCache.put($scope.product.id, {
                    date: $scope.product.date,
                    detail: detail
                });
                $scope.product.detail = detail;
            },function () {

            });
        };
        //生产跟踪
        $http({
            method:'GET',
            url:appConfig.apiPath + '/service/productService?logId=' + $scope.logId
        }).then(function (resp) {
            var data=resp.data;
            $scope.product = data;
            if ($rootScope.productCache.get($scope.product.id) === undefined) {
                $scope.getSkuDetail();
            } else {
                var tempDetail = $rootScope.productCache.get($scope.product.id);
                if (tempDetail.date !== $scope.product.date) {
                    $scope.getSkuDetail();
                } else {
                    $scope.product.detail = tempDetail.detail;
                }
            }
        },function () {

        });
        $scope.queryProductTrack(1);
        // 生产跟踪 进行翻页记录
        $scope.pageChanged = function () {
            $scope.queryProductTrack($scope.tracks.curPage);
        };

        //验证记录
        $scope.record = function (curPage) {

            $http({
                method:'GET',
                url:appConfig.apiPath + '/service/verifyLogs?code=' + $scope.code + '&curPage=' + curPage + '&pageSize=' + $scope.pageSize
            }).then(function (resp) {
                var data=resp.data;
                $scope.verifyLogs = data;
            },function () {

            });
        };
        $scope.record(1);
        $scope.pageChangedRecord = function () {
            $scope.record($scope.verifyLogs.curPage);
        };
        //产品参数
        $scope.noitemDetailstatus = false;//默认为false
        $scope.productParameters = function () {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/service/verifySkuDetail?logId=' + $scope.logId
            }).then(function (resp) {
                var data=resp.data;
                $scope.itemDetail = data;
                if ($scope.itemDetail.status) {
                    $scope.noitemDetailstatus = false;
                } else {
                    $scope.noitemDetailstatus = true;
                }
            },function () {

            });
        };
        $scope.productParameters();

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