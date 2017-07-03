(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 输入密码
         */
        $stateProvider.state("main.previewTemplate.sell", {
            url: '/sell',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/sell/index.root.html',
                    controller: previewTemplateSellController
                }
            }
        });
    }]);
    previewTemplateSellController.$inject = ['$scope', 'appConfig', 'imgService', '$http', '$interval', '$filter', '$rootScope', '$state'];
    function previewTemplateSellController($scope, appConfig, imgService, $http, $interval, $filter, $rootScope, $state) {
        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.slideImg = imgService.slideImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.indexBelowImg = imgService.indexBelowImg;
        $scope.curPage = 1;
        //获取专题列表
        //获取限时抢购今日特卖
        $scope.getLimit = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/activity/list?pageSize=10&curPage=" + $scope.curPage
            }).then(function (resp) {
                var limitData = resp.data;
                $scope.limitList = limitData;
                $scope.endTime = [];
                $rootScope.intervalStop = [];
                for (var i = 0; i < $scope.limitList.recList.length; i++) {
                    $scope.endTime[i] = $scope.limitList.recList[i].endTime;
                    $scope.limitList.recList[i].activityCheck = {};
                    test(i);
                }

            });
        };
        function test(i) {
            $rootScope.intervalStop[i] = $interval(function () {
                var date = new Date().getTime();
                var oldDate = new Date($filter("date")($scope.endTime[i], "yyyy/MM/dd HH:mm:ss")).getTime();
                // 倒计时到零时，停止倒计时
                var rest = oldDate - date;
                if (rest <= 0) {
                    $scope.limitList.recList[i].activityCheck = null;
                    $interval.cancel($rootScope.intervalStop[i]);
                    $rootScope.intervalStop[i] = null;
                    return;
                }
                var leftsecond = parseInt(rest / 1000);
                var day1 = Math.floor(leftsecond / (60 * 60 * 24));
                var hour1 = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                var minute1 = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600) / 60);
                var second1 = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600 - minute1 * 60);

                $scope.limitList.recList[i].activityCheck.day = day1;
                $scope.limitList.recList[i].activityCheck.hour = hour1;
                $scope.limitList.recList[i].activityCheck.minute = minute1;
                $scope.limitList.recList[i].activityCheck.second = second1;
            }, 1000);
        }

        $scope.getLimit();
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();
