(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.topic", {
            url: '/topic',
            views: {
                "@": {
                    templateUrl: 'views/main/topic/index.root.html',
                    controller: topicController
                }
            }
        });
    }]);
    topicController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', '$timeout'];
    function topicController($scope, $http, $state, appConfig, imgService, $timeout) {
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.slideImg = imgService.slideImg;
        $scope.imgService = imgService;
        $scope.curPage = 1;
        $scope.swiper = {};

        //热门话题
        $scope.getHotDiscuss = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=SUBJECT&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&isHot=true&pageSize=0&curPage=0"
            }).then(function (resp) {
                $scope.hotList = resp.data;
                $timeout(function () {
                    $scope.swiper.update();
                }, 100);
            });
        };
        //全部话题
        $scope.getDiscuss = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=SUBJECT&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&pageSize=10&curPage=" + $scope.curPage
            }).then(function (resp) {
                $scope.list = resp.data;
            });
        };
        $scope.getDiscuss();
        $scope.getHotDiscuss();
        //页面回退
        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };
    }
})();
