(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         *
         */
        $stateProvider.state("main.previewTemplate.coinMall", {
            url: '/coinMall',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/coinMall/index.root.html',
                    controller: coinMallController,
                }
            }
        });
    }]);
    coinMallController.$inject = ['$scope', 'appConfig', 'imgService', '$http', '$state'];
    function coinMallController($scope, appConfig, imgService, $http, $state) {

        //回退界面
        $scope.fallbackPage = function () {
            history.back();
        };

        $scope.swiper = {};
        $scope.comments = new Array(4);
        $scope.num = 'SERVICE';
        $scope.activeShow = function (aaa) {
            $scope.num = aaa;
            $scope.maxSize = appConfig.maxSize;
            //页面展示页数   5
            $scope.pageSize = appConfig.pageSize;
            //页面展示条数   10
            $scope.pageEnd = false;    //是否是最后一页
            $scope.curPage = 1;
            $scope.page();
            console.log($scope.comments);
        };
        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.pageEnd = false;    //是否是最后一页
        $scope.curPage = 1;
        $scope.page = function () {
            console.log($scope.curPage);


            //获取账户信息
            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/itemList?curPage=" + $scope.curPage + "&pageSize=" + $scope.pageSize,
                params: {
                    type: $scope.num
                }
            }).then(function (resp) {
                    var data = resp.data;
                    /**
                     * 判断是否是第1页，不是就追加数据
                     */
                    if ($scope.curPage > 1) {
                        for (var i = 0; i < data.result.length; i++) {
                            $scope.comments.result.push(data.result[i]);
                        }
                    } else {
                        $scope.comments = data;
                    }

                    $scope.curPage = data.curPage + 1;
                    $scope.totalCount = data.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    $scope.pageEnd = false;
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
                }, function () {
                }
            );
        };
        $scope.page();

        $scope.data = {"toDaySign": false, "integral": 0, "sign": 0, "count": 0, "advertise": null};
        $scope.lodingThis = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/integral/index'
            }).then(function (resp) {
                $scope.data = resp.data.result;
            });
        };
        $scope.lodingThis();
        //获取等级信息
    }
})();
