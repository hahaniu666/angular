(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 输入密码
         */
        $stateProvider.state("main.previewTemplate.topics", {
            url: '/topics',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/topics/index.root.html',
                    controller: previewTemplateTopicsController
                }
            }
        });
    }]);
    previewTemplateTopicsController.$inject = ['$scope', 'appConfig', 'imgService', '$http', '$state'];
    function previewTemplateTopicsController($scope, appConfig, imgService, $http, $state) {
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.indexBelowImg = imgService.indexBelowImg;
        $scope.imgService = imgService;
        $scope.curPage = 1;
        //获取专题列表
        $scope.getList = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=TOPIC&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&pageSize=10&curPage=" + $scope.curPage
            }).then(function (resp) {
                var data = resp.data;
                $scope.list = data;
            })
        };
        $scope.getList();

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();
